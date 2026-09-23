import asyncio
import os
import sys
import uuid
from pathlib import Path
from httpx import AsyncClient, ASGITransport

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.main import app
from app.core.config import settings
from app.database.mongodb import db_manager

async def test_step2_complete_verification():
    print("\n" + "=" * 75)
    print("STEP 2: COMPREHENSIVE VERIFICATION — APPLICATION STATUS FLOW ALIGNMENT")
    print("=" * 75)

    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            db = db_manager.db
            assert db is not None, "Database is not connected"

            # Verify target database
            assert settings.MONGO_DB_NAME == "tsfms", f"Expected 'tsfms', got '{settings.MONGO_DB_NAME}'"
            print("  [OK] Runtime database verified strictly as 'tsfms'.")

            # Verify existing applications & audit logs are intact
            apps_count_initial = await db["applications"].count_documents({})
            audits_count_initial = await db["audit_logs"].count_documents({})
            print(f"  [OK] Existing applications in tsfms: {apps_count_initial}")
            print(f"  [OK] Existing audit logs in tsfms: {audits_count_initial}")
            assert apps_count_initial >= 10, "Existing applications should be preserved"
            assert audits_count_initial >= 10, "Existing audit logs should be preserved"

            # Login as Officer to perform admin status updates
            officer_login = await client.post("/api/auth/login", json={
                "email": "officer@mota.gov.in",
                "password": "Officer@2026"
            })
            assert officer_login.status_code == 200, f"Officer login failed: {officer_login.text}"
            officer_token = officer_login.json()["access_token"]
            officer_headers = {"Authorization": f"Bearer {officer_token}"}
            print("  [OK] Authenticated as Authorized MoTA Officer.")

            # Register a fresh citizen applicant for testing status transitions
            test_uid = uuid.uuid4().hex[:8]
            citizen_phone = f"99{str(int(uuid.uuid4().int % 100000000)).zfill(8)}"
            citizen_email = f"status.scholar.{test_uid}@mota.res.in"
            citizen_pwd = "SecureCitizenPass@2026"

            reg_res = await client.post("/api/auth/register", json={
                "name": f"Citizen Scholar {test_uid.upper()}",
                "email": citizen_email,
                "phone": citizen_phone,
                "password": citizen_pwd
            })
            assert reg_res.status_code == 201, f"Citizen registration failed: {reg_res.text}"
            citizen_token = reg_res.json()["access_token"]
            citizen_headers = {"Authorization": f"Bearer {citizen_token}"}
            print(f"  [OK] Registered test citizen: {citizen_email}")

            # -----------------------------------------------------------------
            # TEST A: DRAFT -> SUBMITTED
            # -----------------------------------------------------------------
            print("\n[TEST A] DRAFT -> SUBMITTED...")
            app_payload = {
                "scheme_id": "MOTA-ST-01",
                "personal_details": {
                    "full_name": f"Citizen Scholar {test_uid.upper()}",
                    "gender": "FEMALE",
                    "dob": "2002-05-15",
                    "aadhaar_masked": "XXXX-XXXX-9911",
                    "category": "ST",
                    "tribe_community": "Santhal",
                    "mobile": citizen_phone,
                    "email": citizen_email,
                    "state": "Jharkhand",
                    "district": "Ranchi",
                    "pincode": "834001"
                },
                "academic_details": {
                    "current_course": "Ph.D. in Tribal Folklore",
                    "institution_name": "Ranchi University",
                    "previous_exam_name": "M.A. Anthropology",
                    "previous_exam_percentage": 78.5,
                    "passing_year": "2024",
                    "board_or_university": "Ranchi University"
                },
                "financial_details": {
                    "annual_family_income": 120000,
                    "bank_name": "State Bank of India",
                    "account_holder_name": f"Citizen Scholar {test_uid.upper()}",
                    "account_number_masked": "XXXXXX1234",
                    "ifsc_code": "SBIN0001234",
                    "is_aadhaar_seeded": True
                },
                "status": "DRAFT"
            }
            res_create = await client.post("/api/applications", json=app_payload, headers=citizen_headers)
            assert res_create.status_code == 201, f"Create application failed: {res_create.text}"
            app_data = res_create.json()
            test_app_id = app_data["application_id"]
            assert app_data["status"] == "DRAFT"
            print(f"  [OK] Application created in DRAFT: {test_app_id}")

            # Applicant submits the draft: DRAFT -> SUBMITTED
            res_submit = await client.put(f"/api/applications/{test_app_id}", json={
                "status": "SUBMITTED"
            }, headers=citizen_headers)
            assert res_submit.status_code == 200, f"DRAFT -> SUBMITTED failed: {res_submit.text}"
            assert res_submit.json()["status"] == "SUBMITTED"
            print("  [OK] Test A Passed: DRAFT -> SUBMITTED")

            # -----------------------------------------------------------------
            # TEST B: SUBMITTED -> DOCUMENT_VERIFICATION
            # -----------------------------------------------------------------
            print("\n[TEST B] SUBMITTED -> DOCUMENT_VERIFICATION...")
            res_b = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "DOCUMENT_VERIFICATION",
                "remarks": "Document Scrutiny Cell commencing automated certificate checks."
            }, headers=officer_headers)
            assert res_b.status_code == 200, f"SUBMITTED -> DOCUMENT_VERIFICATION failed: {res_b.text}"
            assert res_b.json()["status"] == "DOCUMENT_VERIFICATION"
            print("  [OK] Test B Passed: SUBMITTED -> DOCUMENT_VERIFICATION")

            # -----------------------------------------------------------------
            # TEST C: DOCUMENT_VERIFICATION -> ELIGIBILITY_VERIFICATION
            # -----------------------------------------------------------------
            print("\n[TEST C] DOCUMENT_VERIFICATION -> ELIGIBILITY_VERIFICATION...")
            res_c = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "ELIGIBILITY_VERIFICATION",
                "remarks": "Certificates valid. Forwarded to statutory eligibility verification cell."
            }, headers=officer_headers)
            assert res_c.status_code == 200, f"DOCUMENT_VERIFICATION -> ELIGIBILITY_VERIFICATION failed: {res_c.text}"
            assert res_c.json()["status"] == "ELIGIBILITY_VERIFICATION"
            print("  [OK] Test C Passed: DOCUMENT_VERIFICATION -> ELIGIBILITY_VERIFICATION")

            # -----------------------------------------------------------------
            # TEST D: ELIGIBILITY_VERIFICATION -> SCRUTINY
            # -----------------------------------------------------------------
            print("\n[TEST D] ELIGIBILITY_VERIFICATION -> SCRUTINY...")
            res_d = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "SCRUTINY",
                "remarks": "Eligibility confirmed against scheme guidelines. Handed to Scrutiny Committee."
            }, headers=officer_headers)
            assert res_d.status_code == 200, f"ELIGIBILITY_VERIFICATION -> SCRUTINY failed: {res_d.text}"
            assert res_d.json()["status"] == "SCRUTINY"
            print("  [OK] Test D Passed: ELIGIBILITY_VERIFICATION -> SCRUTINY")

            # -----------------------------------------------------------------
            # TEST E: SCRUTINY -> SELECTION
            # -----------------------------------------------------------------
            print("\n[TEST E] SCRUTINY -> SELECTION...")
            res_e = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "SELECTION",
                "remarks": "Official scrutiny passed. Placed on National Merit Selection Roster."
            }, headers=officer_headers)
            assert res_e.status_code == 200, f"SCRUTINY -> SELECTION failed: {res_e.text}"
            assert res_e.json()["status"] == "SELECTION"
            print("  [OK] Test E Passed: SCRUTINY -> SELECTION")

            # -----------------------------------------------------------------
            # TEST F: SELECTION -> APPROVED
            # -----------------------------------------------------------------
            print("\n[TEST F] SELECTION -> APPROVED...")
            res_f = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "APPROVED",
                "remarks": "Sanction ratified by MoTA Competent Sanctioning Authority."
            }, headers=officer_headers)
            assert res_f.status_code == 200, f"SELECTION -> APPROVED failed: {res_f.text}"
            assert res_f.json()["status"] == "APPROVED"
            print("  [OK] Test F Passed: SELECTION -> APPROVED")

            # -----------------------------------------------------------------
            # TEST G: DOCUMENT_VERIFICATION -> DEFICIENT (create second application)
            # -----------------------------------------------------------------
            print("\n[TEST G] DOCUMENT_VERIFICATION -> DEFICIENT...")
            app_payload_2 = dict(app_payload)
            app_payload_2["status"] = "SUBMITTED"
            res_create_2 = await client.post("/api/applications", json=app_payload_2, headers=citizen_headers)
            assert res_create_2.status_code == 201
            app_id_2 = res_create_2.json()["application_id"]

            # Advance to DOCUMENT_VERIFICATION
            await client.put(f"/api/admin/applications/{app_id_2}/status", json={
                "status": "DOCUMENT_VERIFICATION"
            }, headers=officer_headers)

            # Move to DEFICIENT
            res_g = await client.put(f"/api/admin/applications/{app_id_2}/status", json={
                "status": "DEFICIENT",
                "remarks": "Income certificate validity expired. Needs FY 2024-25 issuance."
            }, headers=officer_headers)
            assert res_g.status_code == 200, f"DOCUMENT_VERIFICATION -> DEFICIENT failed: {res_g.text}"
            data_g = res_g.json()
            assert data_g["status"] == "DEFICIENT"
            assert data_g["has_deficiency"] is True
            assert data_g["deficiency_notes"] == "Income certificate validity expired. Needs FY 2024-25 issuance."
            print("  [OK] Test G Passed: DOCUMENT_VERIFICATION -> DEFICIENT")

            # -----------------------------------------------------------------
            # TEST H: DEFICIENT -> RESUBMITTED
            # -----------------------------------------------------------------
            print("\n[TEST H] DEFICIENT -> RESUBMITTED...")
            res_h = await client.put(f"/api/applications/{app_id_2}", json={
                "status": "RESUBMITTED"
            }, headers=citizen_headers)
            assert res_h.status_code == 200, f"DEFICIENT -> RESUBMITTED failed: {res_h.text}"
            data_h = res_h.json()
            assert data_h["status"] == "RESUBMITTED"
            assert data_h["has_deficiency"] is False
            print("  [OK] Test H Passed: DEFICIENT -> RESUBMITTED")

            # -----------------------------------------------------------------
            # TEST I: RESUBMITTED -> DOCUMENT_VERIFICATION
            # -----------------------------------------------------------------
            print("\n[TEST I] RESUBMITTED -> DOCUMENT_VERIFICATION...")
            res_i = await client.put(f"/api/admin/applications/{app_id_2}/status", json={
                "status": "DOCUMENT_VERIFICATION",
                "remarks": "Resubmitted documents verified and acknowledged by scrutiny officer."
            }, headers=officer_headers)
            assert res_i.status_code == 200, f"RESUBMITTED -> DOCUMENT_VERIFICATION failed: {res_i.text}"
            assert res_i.json()["status"] == "DOCUMENT_VERIFICATION"
            print("  [OK] Test I Passed: RESUBMITTED -> DOCUMENT_VERIFICATION")

            # -----------------------------------------------------------------
            # TEST J: SCRUTINY -> REJECTED (create third application)
            # -----------------------------------------------------------------
            print("\n[TEST J] SCRUTINY -> REJECTED...")
            res_create_3 = await client.post("/api/applications", json=app_payload_2, headers=citizen_headers)
            assert res_create_3.status_code == 201
            app_id_3 = res_create_3.json()["application_id"]

            # Advance SUBMITTED -> DOCUMENT_VERIFICATION -> ELIGIBILITY_VERIFICATION -> SCRUTINY
            await client.put(f"/api/admin/applications/{app_id_3}/status", json={"status": "DOCUMENT_VERIFICATION"}, headers=officer_headers)
            await client.put(f"/api/admin/applications/{app_id_3}/status", json={"status": "ELIGIBILITY_VERIFICATION"}, headers=officer_headers)
            await client.put(f"/api/admin/applications/{app_id_3}/status", json={"status": "SCRUTINY"}, headers=officer_headers)

            # Move SCRUTINY -> REJECTED
            res_j = await client.put(f"/api/admin/applications/{app_id_3}/status", json={
                "status": "REJECTED",
                "remarks": "Applicant disqualified due to statutory income ceiling violation (> ₹6,00,000)."
            }, headers=officer_headers)
            assert res_j.status_code == 200, f"SCRUTINY -> REJECTED failed: {res_j.text}"
            assert res_j.json()["status"] == "REJECTED"
            print("  [OK] Test J Passed: SCRUTINY -> REJECTED")

            # -----------------------------------------------------------------
            # TEST K: Try an unsupported status such as "DOC_VERIFIED"
            # -----------------------------------------------------------------
            print("\n[TEST K] Testing unsupported status rejection ('DOC_VERIFIED')...")
            res_k = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "DOC_VERIFIED",
                "remarks": "Invalid frontend legacy status attempt."
            }, headers=officer_headers)
            assert res_k.status_code == 422, f"Expected 422 for unsupported status, got {res_k.status_code}: {res_k.text}"
            print(f"  [OK] Test K: Rejected cleanly with HTTP 422 Unprocessable Entity.")

            # Confirm application in MongoDB was NOT modified
            app_check = await db["applications"].find_one({"_id": test_app_id})
            assert app_check["status"] == "APPROVED", f"Application was modified to {app_check['status']} despite 422!"
            print(f"  [OK] Verified application in tsfms.applications remains intact as '{app_check['status']}'.")

            # Also test invalid transition (e.g. attempting to move APPROVED directly to SUBMITTED)
            print("\n[TEST K.2] Testing invalid status transition rejection (APPROVED -> SUBMITTED)...")
            res_invalid_trans = await client.put(f"/api/admin/applications/{test_app_id}/status", json={
                "status": "SUBMITTED",
                "remarks": "Illegal backward transition test."
            }, headers=officer_headers)
            assert res_invalid_trans.status_code == 400, f"Expected 400 Bad Request, got {res_invalid_trans.status_code}"
            print(f"  [OK] Invalid transition rejected with HTTP 400: {res_invalid_trans.json().get('detail')}")

            # -----------------------------------------------------------------
            # VERIFY AUDIT LOGS
            # -----------------------------------------------------------------
            print("\n[AUDIT TRAIL CHECK] Verifying generated audit logs...")
            audit_records = await db["audit_logs"].find({"applicationId": test_app_id}).sort("timestamp", 1).to_list(100)
            print(f"  Audit entries recorded for {test_app_id}: {len(audit_records)}")
            assert len(audit_records) >= 6, "Expected at least 6 audit log entries for application workflow"
            for log in audit_records:
                print(f"    - [{log.get('action')}] Prev: {log.get('previousStatus')} -> New: {log.get('newStatus')} | Actor: {log.get('actor')}")
                assert "previousStatus" in log
                assert "newStatus" in log
                assert "actor" in log
                assert "role" in log
                assert "timestamp" in log

            # -----------------------------------------------------------------
            # VERIFY EXISTING DATA INTEGRITY
            # -----------------------------------------------------------------
            print("\n[DATA INTEGRITY CHECK] Verifying existing tsfms applications & audits...")
            apps_count_final = await db["applications"].count_documents({})
            audits_count_final = await db["audit_logs"].count_documents({})
            print(f"  Applications count: {apps_count_initial} -> {apps_count_final} (+3 created during test)")
            print(f"  Audit logs count: {audits_count_initial} -> {audits_count_final} (increased by logged transitions)")
            assert apps_count_final == apps_count_initial + 3
            assert audits_count_final > audits_count_initial

    print("\n" + "=" * 75)
    print("ALL TESTS (A through K) PASSED WITH 100% SUCCESS AGAINST tsfms!")
    print("=" * 75)

if __name__ == "__main__":
    asyncio.run(test_step2_complete_verification())

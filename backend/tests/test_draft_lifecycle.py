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

async def test_draft_lifecycle():
    print("\n" + "=" * 75)
    print("DRAFT LIFECYCLE VERIFICATION — SAVE, RESTORE, AND SUBMIT TO tsfms")
    print("=" * 75)

    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            db = db_manager.db
            assert db is not None, "Database is not connected"
            assert settings.MONGO_DB_NAME == "tsfms", f"Expected tsfms, got {settings.MONGO_DB_NAME}"
            print("  [OK] Database verified strictly as 'tsfms'.")

            # 1. Register a test citizen
            test_uid = uuid.uuid4().hex[:8]
            phone = f"98{str(int(uuid.uuid4().int % 100000000)).zfill(8)}"
            email = f"draft.scholar.{test_uid}@mota.res.in"
            pwd = "SecureCitizenPass@2026"

            reg_res = await client.post("/api/auth/register", json={
                "name": f"Draft Scholar {test_uid.upper()}",
                "email": email,
                "phone": phone,
                "password": pwd
            })
            assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
            token = reg_res.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print(f"  [OK] Test citizen registered: {email}")

            # 2. Save partial draft at Step 1 (Personal details only, no academic or financial details)
            print("\n[STEP 1 TEST] Saving initial partial draft at Step 1...")
            draft_payload_step1 = {
                "scheme_id": "MOTA-NFST-01",
                "current_step": 1,
                "personal_details": {
                    "full_name": f"Draft Scholar {test_uid.upper()}",
                    "father_or_husband_name": "Ramesh Scholar",
                    "gender": "FEMALE",
                    "dob": "2001-05-14",
                    "aadhaar_masked": "XXXX-XXXX-9012",
                    "category": "ST",
                    "tribe_community": "Santhal",
                    "mobile": phone,
                    "email": email,
                    "state": "Jharkhand",
                    "district": "Ranchi",
                    "pincode": "834001"
                }
            }
            res_draft1 = await client.post("/api/applications/draft", json=draft_payload_step1, headers=headers)
            assert res_draft1.status_code == 200, f"Draft save failed: {res_draft1.text}"
            draft_data1 = res_draft1.json()
            draft_id = draft_data1["application_id"]
            assert draft_data1["status"] == "DRAFT"
            assert draft_data1["current_step"] == 1
            assert draft_data1["personal_details"]["full_name"] == f"Draft Scholar {test_uid.upper()}"
            print(f"  [OK] Initial draft created with ID: {draft_id}")
            print(f"  [OK] Status is DRAFT, current_step is 1, personal details saved.")

            # 3. Verify directly in MongoDB Atlas 'tsfms.applications'
            atlas_doc = await db["applications"].find_one({"_id": draft_id})
            assert atlas_doc is not None, "Draft not found in Atlas tsfms.applications"
            assert atlas_doc["status"] == "DRAFT"
            assert atlas_doc["current_step"] == 1
            print("  [OK] Confirmed live persistence in MongoDB Atlas tsfms.applications collection.")

            # 4. Update draft to Step 3 with Academic Details
            print("\n[STEP 3 TEST] Updating draft with Academic Details at Step 3...")
            draft_payload_step3 = {
                "application_id": draft_id,
                "scheme_id": "MOTA-NFST-01",
                "current_step": 3,
                "academic_details": {
                    "current_course": "Ph.D. Anthropology",
                    "institution_name": "Ranchi University",
                    "institution_state": "Jharkhand",
                    "aishe_code": "U-0234",
                    "roll_number": "RU/ANTH/2026/01",
                    "year_of_study": "1st Year",
                    "previous_exam_name": "M.A. Anthropology",
                    "previous_exam_percentage": 78.5,
                    "passing_year": "2025",
                    "board_or_university": "Ranchi University"
                }
            }
            res_draft3 = await client.post("/api/applications/draft", json=draft_payload_step3, headers=headers)
            assert res_draft3.status_code == 200, f"Step 3 draft update failed: {res_draft3.text}"
            draft_data3 = res_draft3.json()
            assert draft_data3["current_step"] == 3
            assert draft_data3["academic_details"]["current_course"] == "Ph.D. Anthropology"
            # Previous personal details must be preserved!
            assert draft_data3["personal_details"]["tribe_community"] == "Santhal"
            print(f"  [OK] Draft updated to current_step 3; personal details merged & preserved.")

            # 5. Simulate applicant leaving and returning: Fetch via GET /api/applications/my
            print("\n[RESTORE TEST] Simulating applicant login / restoring dossier...")
            res_my = await client.get("/api/applications/my", headers=headers)
            assert res_my.status_code == 200
            my_apps = res_my.json()
            matching_draft = next((a for a in my_apps if a["application_id"] == draft_id), None)
            assert matching_draft is not None, "Draft not listed in /api/applications/my"
            assert matching_draft["status"] == "DRAFT"
            assert matching_draft["current_step"] == 3
            assert matching_draft["academic_details"]["previous_exam_percentage"] == 78.5
            print(f"  [OK] Dossier restored via GET /api/applications/my. Step: {matching_draft['current_step']}.")

            # 6. Add Bank Details and Finalize Submission (DRAFT -> SUBMITTED)
            print("\n[SUBMIT TEST] Completing Financial details and Submitting Application (DRAFT -> SUBMITTED)...")
            submit_payload = {
                "current_step": 8,
                "financial_details": {
                    "annual_family_income": 180000,
                    "bank_name": "State Bank of India",
                    "account_holder_name": f"Draft Scholar {test_uid.upper()}",
                    "account_number_masked": "XXXXXX4321",
                    "ifsc_code": "SBIN0000167",
                    "branch_name": "Main Branch Ranchi",
                    "is_aadhaar_seeded": True
                },
                "status": "SUBMITTED"
            }
            res_submit = await client.put(f"/api/applications/{draft_id}", json=submit_payload, headers=headers)
            assert res_submit.status_code == 200, f"Submission failed: {res_submit.text}"
            final_app = res_submit.json()
            assert final_app["status"] == "SUBMITTED"
            print(f"  [OK] Application successfully transitioned from DRAFT -> SUBMITTED: {draft_id}")

            # 7. Check audit logs in tsfms.audit_logs
            audit_entries = await db["audit_logs"].find({"applicationId": draft_id}).to_list(length=10)
            print(f"  [OK] Audit trail records for {draft_id}: {len(audit_entries)}")
            for a in audit_entries:
                print(f"    - Action: '{a.get('action')}' | Status: {a.get('previousStatus')} -> {a.get('newStatus')} | Actor: {a.get('actor')}")
            assert len(audit_entries) >= 2, "Expected at least 2 audit entries (Draft Saved & Status Changed to SUBMITTED)"

            # Clean up test user & application
            await db["applications"].delete_one({"_id": draft_id})
            await db["users"].delete_one({"email": email})
            await db["audit_logs"].delete_many({"applicationId": draft_id})
            print("  [OK] Test cleanup completed cleanly.")

    print("\n" + "=" * 75)
    print("ALL DRAFT LIFECYCLE TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 75)

if __name__ == "__main__":
    asyncio.run(test_draft_lifecycle())

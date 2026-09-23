import asyncio
import io
import os
import sys
import uuid
from pathlib import Path
import pypdf
from httpx import AsyncClient, ASGITransport

# Ensure backend root is on sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.main import app
from app.core.config import settings
from app.database.mongodb import db_manager

def create_sample_pdf(text: str) -> bytes:
    """Helper to generate a genuine PDF binary containing text streams."""
    writer = pypdf.PdfWriter()
    # Create a blank page
    writer.add_blank_page(width=612, height=792)
    metadata = {
        "/Producer": "Government of India e-District Service Portal",
        "/Title": "Statutory Certificate",
        "/Subject": text
    }
    writer.add_metadata(metadata)
    
    # We can also write raw PDF text content stream into page
    # In PDF, a basic stream with BT /Font Tf (text) Tj ET encodes real searchable text
    page = writer.pages[0]
    
    # Clean text of parentheses and newlines for PDF stream encoding
    safe_lines = [line.replace("(", "").replace(")", "").strip() for line in text.split("\n") if line.strip()]
    stream_ops = "BT /F1 12 Tf 50 720 Td 14 TL "
    for line in safe_lines:
        stream_ops += f"({line}) ' "
    stream_ops += "ET"

    # Add content stream to page
    content_stream = pypdf.generic.DecodedStreamObject()
    content_stream.set_data(stream_ops.encode("latin-1", errors="replace"))
    page[pypdf.generic.NameObject("/Contents")] = content_stream

    # Add standard font dictionary so PDF extractors read it properly
    font_dict = pypdf.generic.DictionaryObject({
        pypdf.generic.NameObject("/Type"): pypdf.generic.NameObject("/Font"),
        pypdf.generic.NameObject("/Subtype"): pypdf.generic.NameObject("/Type1"),
        pypdf.generic.NameObject("/BaseFont"): pypdf.generic.NameObject("/Helvetica"),
    })
    fonts = pypdf.generic.DictionaryObject({pypdf.generic.NameObject("/F1"): font_dict})
    page[pypdf.generic.NameObject("/Resources")] = pypdf.generic.DictionaryObject({
        pypdf.generic.NameObject("/Font"): fonts
    })

    out = io.BytesIO()
    writer.write(out)
    return out.getvalue()

async def test_ocr_and_document_type_verification():
    print("\n" + "=" * 78)
    print("STEP 4 VERIFICATION: REAL OCR & DOCUMENT TYPE CLASSIFICATION IN tsfms")
    print("=" * 78)

    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            db = db_manager.db
            assert db is not None, "Database is not connected"
            assert settings.MONGO_DB_NAME == "tsfms", f"Expected tsfms, got {settings.MONGO_DB_NAME}"
            print("  [OK] Database verified strictly as 'tsfms'.")

            # 1. Register test citizen and draft application
            test_uid = uuid.uuid4().hex[:8]
            phone = f"97{str(int(uuid.uuid4().int % 100000000)).zfill(8)}"
            email = f"ocr.tester.{test_uid}@mota.res.in"
            pwd = "SecureOcrPass@2026"

            reg_res = await client.post("/api/auth/register", json={
                "name": f"OCR Scholar {test_uid.upper()}",
                "email": email,
                "phone": phone,
                "password": pwd
            })
            assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
            token = reg_res.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print(f"  [OK] Test citizen registered: {email}")

            # Create an application in DRAFT
            app_res = await client.post("/api/applications/draft", json={
                "scheme_id": "MOTA-NFST-01",
                "current_step": 5,
                "personal_details": {
                    "full_name": f"OCR Scholar {test_uid.upper()}",
                    "category": "ST",
                    "tribe_community": "Santhal"
                }
            }, headers=headers)
            assert app_res.status_code == 200, f"Draft creation failed: {app_res.text}"
            app_id = app_res.json()["application_id"]
            print(f"  [OK] Active draft application established: {app_id}")

            # 2. Build Authentic Test Document Binaries
            st_text = (
                "GOVERNMENT OF JHARKHAND - OFFICE OF THE SUB-DIVISIONAL OFFICER / TEHSILDAR\n"
                "CASTE CERTIFICATE FOR NOTIFIED SCHEDULED TRIBE\n"
                f"This is to certify that Shri Rajesh Munda, son of Ramesh Munda, resident of Khunti\n"
                "belongs to the Santhal Community which is recognized as a Scheduled Tribe under\n"
                "the Constitution (Scheduled Tribes) Order, 1950 as amended and Article 342 of Constitution.\n"
                "Certificate No: ST/JH/2024/77812. Issued by Sub-Divisional Magistrate."
            )
            st_pdf = create_sample_pdf(st_text)

            inc_text = (
                "GOVERNMENT OF JHARKHAND - REVENUE & LAND REFORMS DEPARTMENT\n"
                "ANNUAL INCOME CERTIFICATE (FINANCIAL YEAR 2024-25)\n"
                "This is to certify that the total annual family income from all sources of the family\n"
                "is Rs. 1,80,000/- (Rupees One Lakh Eighty Thousand Only) per annum for FY 2024-25.\n"
                "Certificate No: INC/JH/2024/90214. Issued by Circle Officer / Tehsildar."
            )
            inc_pdf = create_sample_pdf(inc_text)

            mark_text = (
                "CENTRAL BOARD OF SECONDARY EDUCATION - DELHI\n"
                "SENIOR SCHOOL CERTIFICATE EXAMINATION - STATEMENT OF MARKS\n"
                "Roll Number: 6628912. Student: Rajesh Munda.\n"
                "Marks Obtained: 420. Maximum Marks: 500. Percentage of Marks: 84.0%.\n"
                "Board of Secondary Education. Year of Passing: 2024. Result: Passed."
            )
            mark_pdf = create_sample_pdf(mark_text)

            bank_text = (
                "STATE BANK OF INDIA - SAVINGS BANK PASSBOOK\n"
                "State Bank of India, Main Branch Ranchi.\n"
                "Savings Bank Account Number: 33902188412.\n"
                "Account Holder: Rajesh Munda. IFSC Code: SBIN0000167. MICR Code: 834002002.\n"
                "Branch Name: Main Branch Ranchi. DBT Aadhaar Seeding: Active."
            )
            bank_pdf = create_sample_pdf(bank_text)

            low_quality_text = "..."  # Almost zero text
            low_quality_pdf = create_sample_pdf(low_quality_text)

            # -------------------------------------------------------------
            # TEST 1: Required ST Certificate + Upload Genuine ST Certificate
            # -------------------------------------------------------------
            print("\n[TEST 1] Verifying ST Certificate against ST_CERTIFICATE slot...")
            files1 = {"file": ("ST_Certificate.pdf", st_pdf, "application/pdf")}
            data1 = {"required_document_type": "ST_CERTIFICATE"}
            res1 = await client.post("/api/documents/verify-type", data=data1, files=files1, headers=headers)
            assert res1.status_code == 200, f"Verify failed: {res1.text}"
            v1 = res1.json()
            print(f"  Match Status : {v1['match_status']}")
            print(f"  Detected Type: {v1['detected_document_type']}")
            print(f"  Confidence   : {v1['confidence']}")
            print(f"  Message      : {v1['message']}")
            assert v1["match_status"] == "TYPE_MATCH"
            assert v1["detected_document_type"] == "ST_CERTIFICATE"
            assert v1["confidence"] >= 0.70
            assert v1["is_acceptable"] is True
            print("  [OK] Test 1 Passed: Genuine ST Certificate matched with high confidence.")

            # -------------------------------------------------------------
            # TEST 2: Required ST Certificate + Upload Income Certificate (Mismatch!)
            # -------------------------------------------------------------
            print("\n[TEST 2] Verifying Income Certificate uploaded to ST_CERTIFICATE slot (Expected Mismatch)...")
            files2 = {"file": ("Income_Certificate.pdf", inc_pdf, "application/pdf")}
            data2 = {"required_document_type": "ST_CERTIFICATE"}
            res2 = await client.post("/api/documents/verify-type", data=data2, files=files2, headers=headers)
            assert res2.status_code == 200, f"Verify failed: {res2.text}"
            v2 = res2.json()
            print(f"  Match Status : {v2['match_status']}")
            print(f"  Detected Type: {v2['detected_document_type']}")
            print(f"  Confidence   : {v2['confidence']}")
            print(f"  Message      : {v2['message']}")
            assert v2["match_status"] == "TYPE_MISMATCH"
            assert v2["detected_document_type"] == "INCOME_CERTIFICATE"
            assert v2["is_acceptable"] is False
            assert "requires ST Community / Caste Certificate" in v2["message"]
            print("  [OK] Test 2 Passed: Income Certificate correctly detected as TYPE_MISMATCH in ST slot.")

            # -------------------------------------------------------------
            # TEST 3: Required Income Certificate + Upload ST Certificate (Inverse Mismatch!)
            # -------------------------------------------------------------
            print("\n[TEST 3] Verifying ST Certificate uploaded to INCOME_CERTIFICATE slot (Expected Mismatch)...")
            files3 = {"file": ("ST_Certificate.pdf", st_pdf, "application/pdf")}
            data3 = {"required_document_type": "INCOME_CERTIFICATE"}
            res3 = await client.post("/api/documents/verify-type", data=data3, files=files3, headers=headers)
            assert res3.status_code == 200, f"Verify failed: {res3.text}"
            v3 = res3.json()
            print(f"  Match Status : {v3['match_status']}")
            print(f"  Detected Type: {v3['detected_document_type']}")
            print(f"  Message      : {v3['message']}")
            assert v3["match_status"] == "TYPE_MISMATCH"
            assert v3["detected_document_type"] == "ST_CERTIFICATE"
            assert v3["is_acceptable"] is False
            print("  [OK] Test 3 Passed: Inverse mismatch successfully identified.")

            # -------------------------------------------------------------
            # TEST 4: Marksheet Verification
            # -------------------------------------------------------------
            print("\n[TEST 4] Verifying Marksheet against MARKSHEET slot...")
            files4 = {"file": ("Class12_Marksheet.pdf", mark_pdf, "application/pdf")}
            data4 = {"required_document_type": "MARKSHEET"}
            res4 = await client.post("/api/documents/verify-type", data=data4, files=files4, headers=headers)
            assert res4.status_code == 200
            v4 = res4.json()
            assert v4["match_status"] == "TYPE_MATCH"
            assert v4["detected_document_type"] == "MARKSHEET"
            assert v4["is_acceptable"] is True
            print("  [OK] Test 4 Passed: Marksheet verified with TYPE_MATCH.")

            # -------------------------------------------------------------
            # TEST 5: Bank Passbook Verification
            # -------------------------------------------------------------
            print("\n[TEST 5] Verifying Bank Passbook against BANK_DOCUMENT slot...")
            files5 = {"file": ("SBI_Passbook.pdf", bank_pdf, "application/pdf")}
            data5 = {"required_document_type": "BANK_DOCUMENT"}
            res5 = await client.post("/api/documents/verify-type", data=data5, files=files5, headers=headers)
            assert res5.status_code == 200
            v5 = res5.json()
            assert v5["match_status"] == "TYPE_MATCH"
            assert v5["detected_document_type"] == "BANK_DOCUMENT"
            assert v5["is_acceptable"] is True
            print("  [OK] Test 5 Passed: Bank Passbook verified with TYPE_MATCH.")

            # -------------------------------------------------------------
            # TEST 6: Poor Quality / Blurred Scan Handling
            # -------------------------------------------------------------
            print("\n[TEST 6] Testing low quality / unreadable document...")
            files6 = {"file": ("Blurred_Scan.pdf", low_quality_pdf, "application/pdf")}
            data6 = {"required_document_type": "ST_CERTIFICATE"}
            res6 = await client.post("/api/documents/verify-type", data=data6, files=files6, headers=headers)
            assert res6.status_code == 200
            v6 = res6.json()
            print(f"  Match Status : {v6['match_status']}")
            print(f"  Message      : {v6['message']}")
            assert v6["match_status"] in ("LOW_QUALITY", "MANUAL_REVIEW")
            assert v6["is_acceptable"] is False
            print("  [OK] Test 6 Passed: Low quality document handled gracefully without crash.")

            # -------------------------------------------------------------
            # TEST 7: Full Upload API - Rejection of Mismatched Document
            # -------------------------------------------------------------
            print("\n[TEST 7] Testing POST /api/documents/upload with Mismatched Document (Must Reject 422)...")
            upload_mismatch = {
                "application_id": app_id,
                "document_type": "ST_CERTIFICATE"
            }
            files_mismatch = {"file": ("Wrong_Income_File.pdf", inc_pdf, "application/pdf")}
            res_upload_bad = await client.post("/api/documents/upload", data=upload_mismatch, files=files_mismatch, headers=headers)
            assert res_upload_bad.status_code == 422, f"Expected 422 Mismatch, got {res_upload_bad.status_code}: {res_upload_bad.text}"
            err_data = res_upload_bad.json()["detail"]
            assert err_data["error"] == "DOCUMENT_TYPE_MISMATCH"
            assert err_data["detected_type"] == "INCOME_CERTIFICATE"
            assert err_data["required_type"] == "ST_CERTIFICATE"
            print(f"  [OK] Correctly rejected with HTTP 422: {err_data['message']}")

            # -------------------------------------------------------------
            # TEST 8: Full Upload API - Acceptance of Matching Document
            # -------------------------------------------------------------
            print("\n[TEST 8] Testing POST /api/documents/upload with Matching ST Document (Must Accept 201)...")
            upload_good = {
                "application_id": app_id,
                "document_type": "ST_CERTIFICATE"
            }
            files_good = {"file": ("Genuine_ST_Certificate.pdf", st_pdf, "application/pdf")}
            res_upload_ok = await client.post("/api/documents/upload", data=upload_good, files=files_good, headers=headers)
            assert res_upload_ok.status_code == 201, f"Expected 201 Created, got {res_upload_ok.status_code}: {res_upload_ok.text}"
            doc_data = res_upload_ok.json()
            doc_id = doc_data["document_id"]
            assert doc_data["ocr_processed"] is True
            assert doc_data["verification_status"] == "TYPE_MATCH"
            print(f"  [OK] Document uploaded successfully: ID={doc_id}, Status={doc_data['verification_status']}")

            # -------------------------------------------------------------
            # TEST 9: Verify Live Metadata Storage in MongoDB Atlas 'tsfms'
            # -------------------------------------------------------------
            print("\n[TEST 9] Verifying live document record in MongoDB Atlas tsfms.documents...")
            atlas_doc = await db["documents"].find_one({"_id": doc_id})
            assert atlas_doc is not None, "Document record not found in tsfms.documents"
            assert atlas_doc["ocr_processed"] is True
            assert atlas_doc["detected_document_type"] == "ST_CERTIFICATE"
            assert atlas_doc["verification_status"] == "TYPE_MATCH"
            assert atlas_doc["classification_confidence"] >= 0.70
            assert "certificate_number" in atlas_doc.get("extracted_fields", {})
            print(f"  [OK] Confirmed live persistence in tsfms.documents with structured OCR metadata.")
            print(f"  [OK] Certificate number extracted: {atlas_doc['extracted_fields'].get('certificate_number')}")

            # -------------------------------------------------------------
            # TEST 10: Unsupported File Extension / Magic Bytes
            # -------------------------------------------------------------
            print("\n[TEST 10] Testing corrupted / unsupported file format...")
            files_invalid = {"file": ("malicious.exe", b"MZThisIsAnExecutableNotAPdf", "application/octet-stream")}
            res_invalid = await client.post("/api/documents/upload", data=upload_good, files=files_invalid, headers=headers)
            assert res_invalid.status_code in (400, 422), f"Expected validation failure, got {res_invalid.status_code}"
            print(f"  [OK] Invalid file format rejected cleanly: {res_invalid.json().get('detail')}")

            # Clean up test user & documents
            await db["documents"].delete_one({"_id": doc_id})
            await db["applications"].delete_one({"_id": app_id})
            await db["users"].delete_one({"email": email})
            await db["audit_logs"].delete_many({"application_id": app_id})
            print("\n  [OK] Test cleanup completed cleanly.")

    print("\n" + "=" * 78)
    print("ALL STEP 4 OCR & DOCUMENT TYPE VERIFICATION TESTS PASSED (100% SUCCESS)!")
    print("=" * 78)

if __name__ == "__main__":
    asyncio.run(test_ocr_and_document_type_verification())

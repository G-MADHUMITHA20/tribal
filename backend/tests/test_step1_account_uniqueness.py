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

async def test_step1_complete_verification():
    print("\n" + "=" * 70)
    print("STEP 1: COMPREHENSIVE VERIFICATION — USER ACCOUNT UNIQUENESS & INTEGRITY")
    print("=" * 70)

    # 1. Backend starts & 2. MongoDB Atlas connects via app lifespan
    async with app.router.lifespan_context(app):
        print("\n[CHECK 1 & 2] Backend Lifespan initialized & connected to MongoDB Atlas...")
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            # Check /api/health probe
            health_res = await client.get("/api/health")
            assert health_res.status_code == 200, f"Health check failed: {health_res.text}"
            print("  [OK] Backend started successfully (/api/health -> 200 OK)")

            # Check /api/health/db probe
            db_health_res = await client.get("/api/health/db")
            assert db_health_res.status_code == 200, f"DB Health check failed: {db_health_res.text}"
            db_health_data = db_health_res.json()
            print(f"  [OK] Connected to MongoDB: status='{db_health_data.get('status')}', mode='{db_health_data.get('mode')}'")

            # 3. Runtime database is confirmed as: tsfms
            runtime_db = db_health_data.get("database")
            print(f"\n[CHECK 3] Runtime database confirmation:")
            print(f"  Target DB from /api/health/db: '{runtime_db}'")
            print(f"  Settings MONGO_DB_NAME: '{settings.MONGO_DB_NAME}'")
            assert runtime_db == "tsfms", f"Expected database 'tsfms', got '{runtime_db}'"
            assert settings.MONGO_DB_NAME == "tsfms", f"Settings database is not 'tsfms'"
            print("  [OK] Confirmed runtime database is strictly 'tsfms'")

            # 4. Inspect users indexes
            print("\n[CHECK 4] Inspecting 'users' collection indexes in tsfms...")
            db = db_manager.db
            assert db is not None, "Database instance is None"
            index_cursor = db["users"].list_indexes()
            raw_indexes = await index_cursor.to_list(100)
            index_map = {idx["name"]: idx for idx in raw_indexes}

            print("  Existing indexes on 'users':")
            for name, spec in index_map.items():
                print(f"    - {name}: key={spec.get('key')}, unique={spec.get('unique', False)}, sparse={spec.get('sparse', False)}")

            assert "email_1" in index_map, "Index 'email_1' missing on users collection"
            assert index_map["email_1"].get("unique") is True, "'email_1' is not a unique index"

            assert "phone_1" in index_map, "Index 'phone_1' missing on users collection"
            assert index_map["phone_1"].get("unique") is True, "'phone_1' is not a unique index"
            print("  [OK] Confirmed database-level unique indexes: email (unique=True), phone (unique=True)")

            # Count users before tests
            count_before = await db["users"].count_documents({})
            print(f"  User count before test suite: {count_before}")

            # Unique data generators
            test_id_a = uuid.uuid4().hex[:8]
            test_id_b = uuid.uuid4().hex[:8]
            # Valid 10-digit Indian numbers starting with 9
            phone_a = f"99{str(int(uuid.uuid4().int % 100000000)).zfill(8)}"
            phone_b = f"98{str(int(uuid.uuid4().int % 100000000)).zfill(8)}"
            email_a = f"scholar.test.{test_id_a}@mota.res.in"
            email_b = f"scholar.test.{test_id_b}@mota.res.in"
            password_test = "SecureScholarPass@2026"

            # 5. Register a new unique user
            print(f"\n[CHECK 5] Registering new unique user A ({email_a}, phone={phone_a})...")
            payload_a = {
                "name": f"Scholar {test_id_a.upper()}",
                "email": email_a.upper(), # test normalization
                "phone": f"+91 {phone_a}", # test normalization
                "password": password_test
            }
            res_reg_a = await client.post("/api/auth/register", json=payload_a)
            assert res_reg_a.status_code == 201, f"Expected 201 Created, got {res_reg_a.status_code}: {res_reg_a.text}"
            data_a = res_reg_a.json()
            token_a = data_a["access_token"]
            user_a = data_a["user"]
            assert user_a["email"] == email_a.lower(), "Email was not properly normalized to lowercase"
            assert user_a["phone"] == phone_a, "Phone was not properly normalized"
            user_a_id = user_a["id"]
            print(f"  [OK] User A registered successfully: ID={user_a_id}, Email={user_a['email']}, Phone={user_a['phone']}")

            # 6. Register another user using the same email (Case-insensitive check)
            print(f"\n[CHECK 6] Attempting duplicate email registration ({email_a})...")
            payload_dup_email = {
                "name": "Duplicate Email Attempt",
                "email": email_a.lower(),
                "phone": phone_b,
                "password": password_test
            }
            res_dup_email = await client.post("/api/auth/register", json=payload_dup_email)
            assert res_dup_email.status_code == 409, f"Expected 409 Conflict, got {res_dup_email.status_code}: {res_dup_email.text}"
            assert res_dup_email.json().get("detail") == "An account with this email already exists."
            print(f"  [OK] Duplicate email rejected with HTTP 409: {res_dup_email.json()}")

            # 7. Register another user using the same phone
            print(f"\n[CHECK 7] Attempting duplicate phone registration ({phone_a})...")
            payload_dup_phone = {
                "name": "Duplicate Phone Attempt",
                "email": email_b,
                "phone": f"0{phone_a}", # with leading 0 to test normalization collision
                "password": password_test
            }
            res_dup_phone = await client.post("/api/auth/register", json=payload_dup_phone)
            assert res_dup_phone.status_code == 409, f"Expected 409 Conflict, got {res_dup_phone.status_code}: {res_dup_phone.text}"
            assert res_dup_phone.json().get("detail") == "An account with this phone number already exists."
            print(f"  [OK] Duplicate phone rejected with HTTP 409: {res_dup_phone.json()}")

            # 8. Register another user with a different email and phone
            print(f"\n[CHECK 8] Registering user B with unique email & phone ({email_b}, phone={phone_b})...")
            payload_b = {
                "name": f"Scholar {test_id_b.upper()}",
                "email": email_b,
                "phone": phone_b,
                "password": password_test
            }
            res_reg_b = await client.post("/api/auth/register", json=payload_b)
            assert res_reg_b.status_code == 201, f"Expected 201 Created, got {res_reg_b.status_code}: {res_reg_b.text}"
            user_b = res_reg_b.json()["user"]
            print(f"  [OK] User B registered successfully: ID={user_b['id']}, Email={user_b['email']}")

            # 9. Login with the new user (User A)
            print(f"\n[CHECK 9] Testing login for User A ({email_a.upper()})...")
            login_res = await client.post("/api/auth/login", json={
                "email": email_a.upper(), # uppercase login to verify case-insensitivity
                "password": password_test
            })
            assert login_res.status_code == 200, f"Expected 200 OK, got {login_res.status_code}: {login_res.text}"
            login_data = login_res.json()
            new_jwt = login_data["access_token"]
            assert login_data["user"]["id"] == user_a_id
            print("  [OK] Login succeeded with normalized email and issued valid JWT.")

            # 10. Call GET /api/auth/me using the new JWT
            print(f"\n[CHECK 10] Calling GET /api/auth/me with User A's token...")
            me_res = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {new_jwt}"})
            assert me_res.status_code == 200, f"Expected 200 OK, got {me_res.status_code}: {me_res.text}"
            me_user = me_res.json()
            assert me_user["id"] == user_a_id, f"Expected user {user_a_id}, got {me_user['id']}"
            assert me_user["email"] == email_a.lower()
            assert me_user["phone"] == phone_a
            print(f"  [OK] /api/auth/me returned correct isolated profile: {me_user['name']} ({me_user['id']})")

            # 11. Restart backend simulation
            print(f"\n[CHECK 11] Simulating backend restart (closing and re-establishing connection pool)...")
            db_manager.close()
            await db_manager.init_connection()
            print("  [OK] Backend connection restarted and re-verified against MongoDB Atlas.")

            # 12. Confirm the created user still exists in MongoDB Atlas tsfms (Persistence Check)
            print(f"\n[CHECK 12] Confirming persistence of User A ({user_a_id}) in Atlas 'tsfms'...")
            reconnected_db = db_manager.db
            persisted_user = await reconnected_db["users"].find_one({"_id": user_a_id})
            assert persisted_user is not None, f"User {user_a_id} not found in MongoDB Atlas after restart!"
            assert persisted_user["email"] == email_a.lower()
            assert persisted_user["phone"] == phone_a
            print(f"  [OK] Confirmed live persistence in Atlas tsfms: Found document _id={persisted_user['_id']}, email={persisted_user['email']}")

            count_after = await reconnected_db["users"].count_documents({})
            print(f"  User count after test suite: {count_after} (increased by exactly 2 users)")
            assert count_after == count_before + 2

    print("\n" + "=" * 70)
    print("ALL 12 STEP 1 CHECKPOINTS VERIFIED SUCCESSFULLY AGAINST tsfms!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_step1_complete_verification())

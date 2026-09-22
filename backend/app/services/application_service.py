import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.seed_data import INITIAL_SCHEMES_SEED
from app.core.security import hash_password

def generate_application_id(scheme_code: str) -> str:
    """
    Generate an authentic MoTA Government Application ID.
    Format: MOTA/{FinancialYear}/{SchemeAbbrev}/{RandomSeq}
    Example: MOTA/2025-26/NF/10492
    """
    now = datetime.now(timezone.utc)
    fy = f"{now.year}-{str(now.year + 1)[-2:]}"
    parts = scheme_code.split("-")
    abbrev = parts[1] if len(parts) > 1 else "ST"
    seq = random.randint(10000, 99999)
    return f"MOTA/{fy}/{abbrev}/{seq}"

async def seed_schemes_if_empty(db: AsyncIOMotorDatabase) -> None:
    """
    Seed initial MoTA schemes into MongoDB if the collection is empty.
    """
    try:
        count = await db["schemes"].count_documents({})
        if count == 0:
            await db["schemes"].insert_many(INITIAL_SCHEMES_SEED)
    except Exception:
        pass

async def seed_users_if_empty(db: AsyncIOMotorDatabase) -> None:
    """
    Seed initial authorized Officer and Admin accounts if not present.
    """
    now = datetime.now(timezone.utc)
    # Officer
    existing_officer = await db["users"].find_one({"email": "officer@mota.gov.in"})
    if not existing_officer:
        officer_doc = {
            "_id": "USR-OFF-01",
            "name": "Shri Manoj Kumar",
            "email": "officer@mota.gov.in",
            "phone": "9810012345",
            "hashed_password": hash_password("Officer@2026"),
            "role": "OFFICER",
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        await db["users"].insert_one(officer_doc)

    # Admin
    existing_admin = await db["users"].find_one({"email": "admin@mota.gov.in"})
    if not existing_admin:
        admin_doc = {
            "_id": "USR-ADM-01",
            "name": "Dr. Navaljit Kapoor",
            "email": "admin@mota.gov.in",
            "phone": "9810054321",
            "hashed_password": hash_password("Admin@2026"),
            "role": "ADMIN",
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        await db["users"].insert_one(admin_doc)


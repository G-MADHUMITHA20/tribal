import random
from datetime import datetime
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.seed_data import INITIAL_SCHEMES_SEED

def generate_application_id(scheme_code: str) -> str:
    """
    Generate an authentic MoTA Government Application ID.
    Format: MOTA/{FinancialYear}/{SchemeAbbrev}/{RandomSeq}
    Example: MOTA/2025-26/NF/10492
    """
    now = datetime.utcnow()
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

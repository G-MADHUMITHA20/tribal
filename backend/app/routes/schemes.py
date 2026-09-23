import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import require_admin
from app.schemas.scheme import SchemeResponse, SchemeCreate, SchemeUpdate
from app.database.seed_data import INITIAL_SCHEMES_SEED

router = APIRouter(prefix="/schemes", tags=["Schemes"])

def serialize_scheme(doc: dict) -> dict:
    d = dict(doc)
    if "_id" in d:
        d["_id"] = str(d["_id"])
    if "id" not in d or not d["id"]:
        d["id"] = d.get("_id", "")
    return d

@router.get("", response_model=List[SchemeResponse])
async def list_schemes(db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve all configured MoTA scholarship and fellowship schemes.
    Driven dynamically from MongoDB configuration.
    """
    cursor = db["schemes"].find({})
    schemes_docs = await cursor.to_list(length=100)

    # If database not yet seeded, return the seed configuration
    if not schemes_docs:
        schemes_docs = INITIAL_SCHEMES_SEED

    return [SchemeResponse(**serialize_scheme(s)) for s in schemes_docs]

@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve full details and eligibility rules for a specific scheme by ID or code.
    """
    scheme_doc = await db["schemes"].find_one({
        "$or": [
            {"id": scheme_id},
            {"code": scheme_id}
        ]
    })

    if not scheme_doc:
        # Check seed data
        for s in INITIAL_SCHEMES_SEED:
            if s["id"] == scheme_id or s["code"] == scheme_id:
                return SchemeResponse(**serialize_scheme(s))

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with identifier '{scheme_id}' was not found."
        )

    return SchemeResponse(**serialize_scheme(scheme_doc))

@router.post("", response_model=SchemeResponse, status_code=status.HTTP_201_CREATED)
async def create_scheme(
    scheme_in: SchemeCreate,
    admin: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Configure and register a new MoTA scholarship or fellowship scheme.
    Restricted strictly to authorized Administrators.
    Persists to MongoDB Atlas schemes collection and records audit trail.
    """
    scheme_id = scheme_in.id or scheme_in.code.lower().replace(" ", "-")
    
    # Check if duplicate exists
    existing = await db["schemes"].find_one({
        "$or": [
            {"_id": scheme_id},
            {"id": scheme_id},
            {"code": scheme_in.code}
        ]
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scheme with code '{scheme_in.code}' or identifier '{scheme_id}' already exists."
        )

    scheme_dict = scheme_in.model_dump()
    scheme_dict["_id"] = scheme_id
    scheme_dict["id"] = scheme_id
    scheme_dict["category"] = scheme_in.category.value

    await db["schemes"].insert_one(scheme_dict)

    # Record administrative action in audit_logs
    now = datetime.now(timezone.utc)
    audit_entry = {
        "_id": f"AUD-SCH-{int(now.timestamp() * 1000)}",
        "id": f"AUD-SCH-{int(now.timestamp() * 1000)}",
        "timestamp": now,
        "actor": admin.get("name") or admin.get("email") or "MoTA System Administrator",
        "role": "ADMIN",
        "action": f"New Scheme Created: {scheme_dict['name']} ({scheme_dict['code']})",
        "applicationId": scheme_dict["code"],
        "schemeCode": scheme_dict["code"],
        "previousStatus": "NONE",
        "newStatus": "ACTIVE" if scheme_dict.get("is_open") else "CLOSED",
        "reason": "Administrative Policy Configuration",
        "remarks": f"Scheme initialized with annual income cap: Rs. {scheme_dict.get('annual_income_cap', 0):,}",
        "ipAddress": "10.14.88.10 (MoTA Internal Gateway)"
    }
    await db["audit_logs"].insert_one(audit_entry)

    created_doc = await db["schemes"].find_one({"_id": scheme_id})
    return SchemeResponse(**serialize_scheme(created_doc))

@router.put("/{scheme_id}", response_model=SchemeResponse)
async def update_scheme(
    scheme_id: str,
    scheme_update: SchemeUpdate,
    admin: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update rules, criteria, limits, or status for an existing scheme.
    Restricted strictly to authorized Administrators.
    Persists updates to MongoDB Atlas and records changes in audit_logs.
    """
    existing = await db["schemes"].find_one({
        "$or": [
            {"_id": scheme_id},
            {"id": scheme_id},
            {"code": scheme_id}
        ]
    })

    if not existing:
        # Check if it exists in seed data; if so, seed into MongoDB first
        seed_match = next((s for s in INITIAL_SCHEMES_SEED if s["id"] == scheme_id or s["code"] == scheme_id), None)
        if seed_match:
            seed_doc = dict(seed_match)
            seed_doc["_id"] = seed_doc.get("id", scheme_id)
            await db["schemes"].insert_one(seed_doc)
            existing = seed_doc
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scheme '{scheme_id}' was not found in database."
            )

    target_id = existing["_id"]
    update_data = scheme_update.model_dump(exclude_unset=True)

    if "category" in update_data and update_data["category"] is not None:
        update_data["category"] = update_data["category"].value if hasattr(update_data["category"], "value") else str(update_data["category"])

    if "eligibility_rules" in update_data and scheme_update.eligibility_rules is not None:
        update_data["eligibility_rules"] = [r.model_dump() for r in scheme_update.eligibility_rules]

    if "required_documents" in update_data and scheme_update.required_documents is not None:
        update_data["required_documents"] = [d.model_dump() for d in scheme_update.required_documents]

    if "benefits" in update_data and scheme_update.benefits is not None:
        update_data["benefits"] = [b.model_dump() for b in scheme_update.benefits]

    if update_data:
        await db["schemes"].update_one({"_id": target_id}, {"$set": update_data})

    updated_doc = await db["schemes"].find_one({"_id": target_id})

    # Record administrative action in audit_logs
    now = datetime.now(timezone.utc)
    audit_entry = {
        "_id": f"AUD-SCH-{int(now.timestamp() * 1000)}",
        "id": f"AUD-SCH-{int(now.timestamp() * 1000)}",
        "timestamp": now,
        "actor": admin.get("name") or admin.get("email") or "MoTA System Administrator",
        "role": "ADMIN",
        "action": f"Scheme Rules Updated: {updated_doc.get('name')} ({updated_doc.get('code')})",
        "applicationId": updated_doc.get("code"),
        "schemeCode": updated_doc.get("code"),
        "previousStatus": "CONFIGURED",
        "newStatus": "ACTIVE" if updated_doc.get("is_open") else "CLOSED",
        "reason": "Administrative Policy Configuration Update",
        "remarks": f"Updated criteria: Income Cap Rs. {updated_doc.get('annual_income_cap', 0):,}, Rules Count: {len(updated_doc.get('eligibility_rules', []))}",
        "ipAddress": "10.14.88.10 (MoTA Internal Gateway)"
    }
    await db["audit_logs"].insert_one(audit_entry)

    return SchemeResponse(**serialize_scheme(updated_doc))

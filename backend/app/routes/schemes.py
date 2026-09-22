from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.schemas.scheme import SchemeResponse
from app.database.seed_data import INITIAL_SCHEMES_SEED

router = APIRouter(prefix="/schemes", tags=["Schemes"])

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

    return [SchemeResponse(**s) for s in schemes_docs]

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
                return SchemeResponse(**s)

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with identifier '{scheme_id}' was not found."
        )

    return SchemeResponse(**scheme_doc)

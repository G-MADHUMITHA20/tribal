import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import get_current_user_payload
from app.schemas.grievance import GrievanceCreate, GrievanceResponse, GrievanceStatus

router = APIRouter(prefix="/grievances", tags=["Grievances"])

@router.post("", response_model=GrievanceResponse, status_code=status.HTTP_201_CREATED)
async def lodge_grievance(
    g_in: GrievanceCreate,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Lodge an official grievance or dispute ticket with the Ministry.
    """
    user_id = payload.get("sub")
    now = datetime.now(timezone.utc)
    year = now.year
    seq = uuid.uuid4().hex[:6].upper()
    grv_id = f"GRV/{year}/{seq}"

    grv_doc = {
        "_id": grv_id,
        "grievance_id": grv_id,
        "user_id": user_id,
        "application_id": g_in.application_id,
        "scheme_name": g_in.scheme_name or "MoTA Flagship Scheme",
        "category": g_in.category,
        "subject": g_in.subject,
        "description": g_in.description,
        "status": GrievanceStatus.SUBMITTED.value,
        "assigned_officer": "MoTA Grievance Redressal Officer",
        "resolution_remarks": None,
        "created_at": now,
        "updated_at": now
    }

    await db["grievances"].insert_one(grv_doc)

    return GrievanceResponse(**grv_doc)

@router.get("/my", response_model=List[GrievanceResponse])
async def get_my_grievances(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all grievances lodged by the current authenticated citizen.
    """
    user_id = payload.get("sub")
    cursor = db["grievances"].find({"user_id": user_id}).sort("created_at", -1)
    items = await cursor.to_list(length=100)

    return [GrievanceResponse(**i) for i in items]

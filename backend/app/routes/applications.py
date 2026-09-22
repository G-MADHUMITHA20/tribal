from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import get_current_user_payload
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
    ApplicationStatus
)
from app.services.application_service import generate_application_id

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_in: ApplicationCreate,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Submit a new scholarship/fellowship application.
    Automatically assigns a unique government tracking ID.
    """
    user_id = payload.get("sub")
    now = datetime.now(timezone.utc)

    # Lookup scheme code for authentic ID generation
    scheme = await db["schemes"].find_one({"id": app_in.scheme_id})
    scheme_code = scheme.get("code", "MOTA-ST-01") if scheme else "MOTA-ST-01"
    scheme_name = scheme.get("name", "MoTA Scholarship") if scheme else "MoTA Scholarship"

    app_id = generate_application_id(scheme_code)

    app_doc = {
        "_id": app_id,
        "application_id": app_id,
        "user_id": user_id,
        "scheme_id": app_in.scheme_id,
        "scheme_name": scheme_name,
        "status": app_in.status.value,
        "personal_details": app_in.personal_details.model_dump(),
        "academic_details": app_in.academic_details.model_dump(),
        "financial_details": app_in.financial_details.model_dump(),
        "documents": [d.model_dump() for d in (app_in.documents or [])],
        "has_deficiency": False,
        "deficiency_notes": None,
        "officer_remarks": None,
        "created_at": now,
        "updated_at": now
    }

    await db["applications"].insert_one(app_doc)

    return ApplicationResponse(**app_doc)

@router.get("/my", response_model=List[ApplicationResponse])
async def get_my_applications(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all applications submitted by the currently authenticated citizen.
    """
    user_id = payload.get("sub")
    cursor = db["applications"].find({"user_id": user_id}).sort("created_at", -1)
    results = await cursor.to_list(length=100)

    return [ApplicationResponse(**r) for r in results]

@router.get("/{application_id:path}", response_model=ApplicationResponse)
async def get_application_by_id(
    application_id: str,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve specific application dossier by application ID.
    Enforces authorization check for citizen or officer.
    """
    user_id = payload.get("sub")
    user_role = payload.get("role")

    app_doc = await db["applications"].find_one({"_id": application_id})
    if not app_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application '{application_id}' does not exist."
        )

    # Citizen can only view their own applications; Officers can view any
    if user_role == "APPLICANT" and app_doc.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You do not have permission to view this application dossier."
        )

    return ApplicationResponse(**app_doc)

@router.put("/{application_id:path}", response_model=ApplicationResponse)
async def update_application(
    application_id: str,
    app_update: ApplicationUpdate,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update application details, replace documents, or rectify deficiencies.
    """
    user_id = payload.get("sub")
    user_role = payload.get("role")

    existing_app = await db["applications"].find_one({"_id": application_id})
    if not existing_app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application '{application_id}' does not exist."
        )

    if user_role == "APPLICANT" and existing_app.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You cannot modify an application submitted by another user."
        )

    update_fields = {"updated_at": datetime.now(timezone.utc)}

    if app_update.personal_details:
        update_fields["personal_details"] = app_update.personal_details.model_dump()
    if app_update.academic_details:
        update_fields["academic_details"] = app_update.academic_details.model_dump()
    if app_update.financial_details:
        update_fields["financial_details"] = app_update.financial_details.model_dump()
    if app_update.documents is not None:
        update_fields["documents"] = [d.model_dump() for d in app_update.documents]
    if app_update.status:
        update_fields["status"] = app_update.status.value
        if app_update.status == ApplicationStatus.SUBMITTED:
            update_fields["has_deficiency"] = False
            update_fields["deficiency_notes"] = None

    await db["applications"].update_one({"_id": application_id}, {"$set": update_fields})
    updated_doc = await db["applications"].find_one({"_id": application_id})

    return ApplicationResponse(**updated_doc)

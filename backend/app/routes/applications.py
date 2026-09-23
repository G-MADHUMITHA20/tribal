from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import get_current_user, require_applicant
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
    ApplicationStatus,
    ALLOWED_STATUS_TRANSITIONS
)
from app.services.application_service import generate_application_id

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_in: ApplicationCreate,
    current_user: dict = Depends(require_applicant),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Submit a new scholarship/fellowship application.
    Enforces server-side ownership: user_id is taken strictly from current_user['_id'].
    Frontend user_id parameters are never trusted or accepted.
    """
    user_id = current_user["_id"]
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

    # Record application submission in audit_logs
    audit_entry = {
        "_id": f"AUD-{int(now.timestamp() * 1000)}",
        "id": f"AUD-{int(now.timestamp() * 1000)}",
        "timestamp": now,
        "actor": current_user.get("name") or current_user.get("email") or "Citizen Applicant",
        "role": current_user.get("role", "APPLICANT"),
        "action": f"Application Created with status {app_in.status.value}",
        "applicationId": app_id,
        "schemeCode": app_in.scheme_id,
        "previousStatus": "DRAFT",
        "newStatus": app_in.status.value,
        "reason": f"New scholarship application lodged for {scheme_name}",
        "remarks": f"Applied for {scheme_name}",
        "ipAddress": "10.14.88.22 (MoTA Portal Gateway)"
    }
    await db["audit_logs"].insert_one(audit_entry)

    return ApplicationResponse(**app_doc)

@router.get("/my", response_model=List[ApplicationResponse])
async def get_my_applications(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all applications submitted strictly by the currently authenticated citizen.
    Query is scoped to current_user['_id'].
    """
    user_id = current_user["_id"]
    cursor = db["applications"].find({"user_id": user_id}).sort("created_at", -1)
    results = await cursor.to_list(length=100)

    return [ApplicationResponse(**r) for r in results]

@router.get("/{application_id:path}", response_model=ApplicationResponse)
async def get_application_by_id(
    application_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve specific application dossier by application ID.
    Enforces authorization check: Applicants can ONLY access their own application.
    Officers and Admins may access applications for review.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    app_doc = await db["applications"].find_one({"_id": application_id})
    if not app_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application '{application_id}' does not exist."
        )

    # Citizen can only view their own applications; Officers and Admins can view for review
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
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update application details, replace documents, or rectify deficiencies.
    Applicants can ONLY modify their own applications.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

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

    now = datetime.now(timezone.utc)
    update_fields = {"updated_at": now}

    if app_update.personal_details:
        update_fields["personal_details"] = app_update.personal_details.model_dump()
    if app_update.academic_details:
        update_fields["academic_details"] = app_update.academic_details.model_dump()
    if app_update.financial_details:
        update_fields["financial_details"] = app_update.financial_details.model_dump()
    if app_update.documents is not None:
        update_fields["documents"] = [d.model_dump() for d in app_update.documents]
    if app_update.status:
        prev_status_str = existing_app.get("status")
        try:
            prev_status = ApplicationStatus(prev_status_str)
        except ValueError:
            prev_status = None

        if prev_status and app_update.status != prev_status:
            allowed_targets = ALLOWED_STATUS_TRANSITIONS.get(prev_status, [])
            if app_update.status not in allowed_targets:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid status transition from '{prev_status_str}' to '{app_update.status.value}'. Allowed transitions: {[s.value for s in allowed_targets]}"
                )

        update_fields["status"] = app_update.status.value
        if app_update.status in [ApplicationStatus.SUBMITTED, ApplicationStatus.RESUBMITTED]:
            update_fields["has_deficiency"] = False
            update_fields["deficiency_notes"] = None

        # Record in audit_logs
        actor_name = current_user.get("name") or current_user.get("email") or "Citizen Applicant"
        audit_entry = {
            "_id": f"AUD-{int(now.timestamp() * 1000)}",
            "id": f"AUD-{int(now.timestamp() * 1000)}",
            "timestamp": now,
            "actor": actor_name,
            "role": user_role or "APPLICANT",
            "action": f"Application Status Changed to {app_update.status.value}",
            "applicationId": application_id,
            "schemeCode": existing_app.get("scheme_id"),
            "previousStatus": prev_status_str,
            "newStatus": app_update.status.value,
            "reason": "Application update / resubmission by citizen",
            "remarks": "Status updated by applicant",
            "ipAddress": "10.14.88.22 (MoTA Portal Gateway)"
        }
        await db["audit_logs"].insert_one(audit_entry)

    await db["applications"].update_one({"_id": application_id}, {"$set": update_fields})
    updated_doc = await db["applications"].find_one({"_id": application_id})

    return ApplicationResponse(**updated_doc)


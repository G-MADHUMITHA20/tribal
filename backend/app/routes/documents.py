import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import get_current_user
from app.schemas.document import DocumentType, DocumentMetadata, DocumentUploadResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    application_id: str = Form(..., description="Target Application ID"),
    document_type: DocumentType = Form(..., description="Supported certificate category"),
    file: UploadFile = File(..., description="PDF or image scan of document"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Register and store uploaded document metadata.
    Enforces that the authenticated citizen owns the targeted application dossier.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    # Verify target application exists
    application = await db["applications"].find_one({"_id": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target application '{application_id}' does not exist."
        )

    # If applicant, verify ownership
    if user_role == "APPLICANT" and application.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You cannot upload documents to another applicant's application dossier."
        )

    doc_id = "DOC-" + uuid.uuid4().hex[:10].upper()
    now = datetime.now(timezone.utc)

    # Read file size (simulated or actual)
    file_bytes = await file.read()
    file_size = len(file_bytes)

    storage_path = f"s3://tsfms-documents/{application_id}/{doc_id}_{file.filename}"

    doc_record = {
        "_id": doc_id,
        "document_id": doc_id,
        "application_id": application_id,
        "user_id": user_id,
        "document_type": document_type.value,
        "file_name": file.filename or f"{document_type.value}.pdf",
        "file_size_bytes": file_size,
        "content_type": file.content_type or "application/pdf",
        "storage_provider": "S3_MINIO_READY",
        "storage_path": storage_path,
        "status": "UPLOADED",
        "created_at": now
    }

    await db["documents"].insert_one(doc_record)

    return DocumentUploadResponse(
        document_id=doc_id,
        application_id=application_id,
        document_type=document_type,
        file_name=doc_record["file_name"],
        file_size_bytes=file_size,
        storage_path=storage_path,
        message="Document uploaded and metadata registered successfully for verification pipeline."
    )

@router.get("/application/{application_id:path}", response_model=List[DocumentMetadata])
async def get_documents_by_application(
    application_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all document records and storage pointers for a given application ID.
    Enforces authorization check: Applicants can ONLY access documents for their own applications.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    # Verify target application exists
    application = await db["applications"].find_one({"_id": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application '{application_id}' does not exist."
        )

    # If applicant, verify ownership
    if user_role == "APPLICANT" and application.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You do not have permission to view documents belonging to another applicant."
        )

    cursor = db["documents"].find({"application_id": application_id})
    docs = await cursor.to_list(length=50)

    return [DocumentMetadata(**d) for d in docs]

@router.get("/{document_id:path}", response_model=DocumentMetadata)
async def get_document_by_id(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve single document metadata by document ID.
    Verifies document and associated application ownership.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    doc = await db["documents"].find_one({"_id": document_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' does not exist."
        )

    if user_role == "APPLICANT":
        # Check direct user_id match or application ownership
        if doc.get("user_id") != user_id:
            app = await db["applications"].find_one({"_id": doc.get("application_id")})
            if not app or app.get("user_id") != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized: You do not have permission to access this document."
                )

    return DocumentMetadata(**doc)


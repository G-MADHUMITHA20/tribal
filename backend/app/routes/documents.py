import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import get_current_user_payload
from app.schemas.document import DocumentType, DocumentMetadata, DocumentUploadResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    application_id: str = Form(..., description="Target Application ID"),
    document_type: DocumentType = Form(..., description="Supported certificate category"),
    file: UploadFile = File(..., description="PDF or image scan of document"),
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Register and store uploaded document metadata.
    Architecture prepared for AWS S3 / MinIO object storage integration.
    Large binaries are not stored directly in MongoDB.
    """
    user_id = payload.get("sub")
    doc_id = "DOC-" + uuid.uuid4().hex[:10].upper()
    now = datetime.now(timezone.utc)

    # Read file size (simulated or actual)
    file_bytes = await file.read()
    file_size = len(file_bytes)

    # In production, file_bytes are streamed to S3 bucket e.g. s3://tsfms-documents/{application_id}/{doc_id}.pdf
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
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all document records and storage pointers for a given application ID.
    """
    cursor = db["documents"].find({"application_id": application_id})
    docs = await cursor.to_list(length=50)

    return [DocumentMetadata(**d) for d in docs]

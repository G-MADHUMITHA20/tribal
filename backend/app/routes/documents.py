import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import get_current_user
from app.schemas.document import DocumentType, DocumentMetadata, DocumentUploadResponse
from app.services.file_validator import validate_uploaded_file
from app.services.storage_service import storage_service

router = APIRouter(prefix="/documents", tags=["Documents"])

def serialize_document_metadata(doc: dict) -> DocumentMetadata:
    """
    Format document document dict safely for DocumentMetadata Pydantic model.
    """
    return DocumentMetadata(
        document_id=doc.get("document_id") or str(doc.get("_id")),
        application_id=doc.get("application_id", ""),
        user_id=doc.get("user_id", ""),
        document_type=doc.get("document_type", DocumentType.ST_CERTIFICATE),
        file_name=doc.get("file_name", "document.pdf"),
        file_size_bytes=doc.get("file_size_bytes", 0),
        content_type=doc.get("content_type", "application/pdf"),
        storage_provider=doc.get("storage_provider", "LOCAL_STORAGE"),
        storage_path=doc.get("storage_path", ""),
        storage_key=doc.get("storage_key"),
        status=doc.get("status", "UPLOADED"),
        is_active=doc.get("is_active", True),
        superseded_by=doc.get("superseded_by"),
        version=doc.get("version", 1),
        download_url=f"/api/documents/{doc.get('document_id') or doc.get('_id')}/file",
        created_at=doc.get("created_at") or datetime.now(timezone.utc)
    )

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    application_id: str = Form(..., description="Target Application ID"),
    document_type: DocumentType = Form(..., description="Supported certificate category"),
    file: UploadFile = File(..., description="Genuine PDF or image scan of document"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Register and securely store uploaded document binary and metadata.
    Enforces server-side validation: size <= 5MB, non-empty, magic byte checks.
    Enforces application ownership for applicants.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    # 1. Verify target application exists
    application = await db["applications"].find_one({"_id": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target application '{application_id}' does not exist."
        )

    # 2. If applicant, verify ownership
    if user_role == "APPLICANT" and application.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You cannot upload documents to another applicant's application dossier."
        )

    # 3. Read and validate binary content
    file_bytes = await file.read()
    safe_filename, validated_mime = validate_uploaded_file(
        file_bytes=file_bytes,
        filename=file.filename or f"{document_type.value}.pdf",
        content_type=file.content_type or "application/octet-stream"
    )
    file_size = len(file_bytes)

    # 4. Generate unique ID and save binary to secure local storage
    doc_id = "DOC-" + uuid.uuid4().hex[:10].upper()
    now = datetime.now(timezone.utc)

    storage_key = await storage_service.save_file(
        application_id=application_id,
        doc_id=doc_id,
        filename=safe_filename,
        content=file_bytes
    )
    storage_path = f"local://storage/documents/{storage_key}"

    # 5. Insert document metadata into MongoDB Atlas 'documents' collection
    doc_record = {
        "_id": doc_id,
        "document_id": doc_id,
        "application_id": application_id,
        "user_id": user_id,
        "document_type": document_type.value,
        "file_name": safe_filename,
        "file_size_bytes": file_size,
        "content_type": validated_mime,
        "storage_provider": "LOCAL_STORAGE",
        "storage_path": storage_path,
        "storage_key": storage_key,
        "status": "UPLOADED",
        "is_active": True,
        "version": 1,
        "superseded_by": None,
        "created_at": now
    }
    await db["documents"].insert_one(doc_record)

    # 6. Update application's embedded document registry
    app_doc_entry = {
        "id": doc_id,
        "document_code": document_type.value,
        "document_name": safe_filename,
        "file_name": safe_filename,
        "file_url": f"/api/documents/{doc_id}/file",
        "file_size_kb": max(1, file_size // 1024),
        "status": "VALID",
        "uploaded_at": now
    }
    
    # Filter out any prior active document of same type in application record
    existing_docs = application.get("documents", [])
    updated_docs = [d for d in existing_docs if d.get("document_code") != document_type.value]
    updated_docs.append(app_doc_entry)

    await db["applications"].update_one(
        {"_id": application_id},
        {"$set": {"documents": updated_docs, "updated_at": now}}
    )

    # 7. Record statutory audit trail in 'audit_logs'
    audit_entry = {
        "id": "AUD-" + uuid.uuid4().hex[:8].upper(),
        "timestamp": now,
        "actor": current_user.get("name", "Applicant"),
        "role": user_role or "APPLICANT",
        "action": "DOCUMENT_UPLOADED",
        "application_id": application_id,
        "document_id": doc_id,
        "document_type": document_type.value,
        "remarks": f"Document '{safe_filename}' ({max(1, file_size // 1024)} KB) uploaded and verified.",
        "ip_address": "127.0.0.1"
    }
    await db["audit_logs"].insert_one(audit_entry)

    return DocumentUploadResponse(
        document_id=doc_id,
        application_id=application_id,
        document_type=document_type,
        file_name=safe_filename,
        file_size_bytes=file_size,
        storage_path=storage_path,
        storage_key=storage_key,
        download_url=f"/api/documents/{doc_id}/file",
        message="Document uploaded, binary securely stored, and metadata registered.",
        uploaded_at=now
    )

@router.get("/application/{application_id:path}", response_model=List[DocumentMetadata])
async def get_documents_by_application(
    application_id: str,
    active_only: bool = True,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve all document records for a given application ID.
    Enforces authorization: Applicants can ONLY access documents for their own applications.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    application = await db["applications"].find_one({"_id": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application '{application_id}' does not exist."
        )

    if user_role == "APPLICANT" and application.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You do not have permission to view documents belonging to another applicant."
        )

    query = {"application_id": application_id}
    if active_only:
        query["is_active"] = {"$ne": False}

    cursor = db["documents"].find(query).sort("created_at", -1)
    docs = await cursor.to_list(length=100)

    return [serialize_document_metadata(d) for d in docs]

@router.get("/{document_id:path}/file")
async def get_document_file(
    document_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Securely stream the uploaded binary file content with appropriate MIME headers.
    Enforces role authorization: Applicant owns the document/application; Officers/Admins have review rights.
    Guards against path traversal and unauthorized direct object references.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    doc = await db["documents"].find_one({"_id": document_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found."
        )

    # Authorization verification
    if user_role == "APPLICANT":
        if doc.get("user_id") != user_id:
            app = await db["applications"].find_one({"_id": doc.get("application_id")})
            if not app or app.get("user_id") != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized: You do not have permission to access this document binary."
                )

    storage_key = doc.get("storage_key")
    if not storage_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document binary storage location not recorded for this legacy record."
        )

    # Resolve safe physical path
    file_path = storage_service.get_file_path(storage_key)

    # Audit file access event
    now = datetime.now(timezone.utc)
    audit_entry = {
        "id": "AUD-" + uuid.uuid4().hex[:8].upper(),
        "timestamp": now,
        "actor": current_user.get("name", "User"),
        "role": user_role or "OFFICER",
        "action": "DOCUMENT_ACCESSED",
        "application_id": doc.get("application_id"),
        "document_id": document_id,
        "remarks": f"Document binary '{doc.get('file_name')}' accessed/downloaded.",
        "ip_address": "127.0.0.1"
    }
    await db["audit_logs"].insert_one(audit_entry)

    return FileResponse(
        path=str(file_path),
        media_type=doc.get("content_type", "application/pdf"),
        filename=doc.get("file_name", "document.pdf")
    )

@router.post("/{document_id:path}/replace", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def replace_document(
    document_id: str,
    file: UploadFile = File(..., description="Replacement document scan"),
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Replace a deficient or rejected document with a fresh submission.
    Preserves audit history: marks old document as SUPERSEDED (is_active=False),
    stores new document binary, and updates the application status to RESUBMITTED.
    """
    user_id = current_user["_id"]
    user_role = current_user.get("role")

    # 1. Fetch old document
    old_doc = await db["documents"].find_one({"_id": document_id})
    if not old_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Original document '{document_id}' not found."
        )

    application_id = old_doc.get("application_id")
    application = await db["applications"].find_one({"_id": application_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target application '{application_id}' does not exist."
        )

    # 2. Authorization
    if user_role == "APPLICANT" and application.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: You cannot rectify documents for another applicant."
        )

    # 3. Validate new binary
    file_bytes = await file.read()
    safe_filename, validated_mime = validate_uploaded_file(
        file_bytes=file_bytes,
        filename=file.filename or old_doc.get("file_name", "replacement.pdf"),
        content_type=file.content_type or "application/octet-stream"
    )
    file_size = len(file_bytes)

    # 4. Save new binary
    new_doc_id = "DOC-" + uuid.uuid4().hex[:10].upper()
    now = datetime.now(timezone.utc)
    new_version = old_doc.get("version", 1) + 1

    storage_key = await storage_service.save_file(
        application_id=application_id,
        doc_id=new_doc_id,
        filename=safe_filename,
        content=file_bytes
    )
    storage_path = f"local://storage/documents/{storage_key}"

    # 5. Mark old document as SUPERSEDED
    await db["documents"].update_one(
        {"_id": document_id},
        {"$set": {
            "is_active": False,
            "status": "SUPERSEDED",
            "superseded_by": new_doc_id,
            "updated_at": now
        }}
    )

    # 6. Insert new document
    new_doc_record = {
        "_id": new_doc_id,
        "document_id": new_doc_id,
        "application_id": application_id,
        "user_id": user_id,
        "document_type": old_doc.get("document_type"),
        "file_name": safe_filename,
        "file_size_bytes": file_size,
        "content_type": validated_mime,
        "storage_provider": "LOCAL_STORAGE",
        "storage_path": storage_path,
        "storage_key": storage_key,
        "status": "UPLOADED",
        "is_active": True,
        "version": new_version,
        "superseded_by": None,
        "created_at": now
    }
    await db["documents"].insert_one(new_doc_record)

    # 7. Update application state: mark as RESUBMITTED, clear deficiency flag
    app_doc_entry = {
        "id": new_doc_id,
        "document_code": old_doc.get("document_type"),
        "document_name": safe_filename,
        "file_name": safe_filename,
        "file_url": f"/api/documents/{new_doc_id}/file",
        "file_size_kb": max(1, file_size // 1024),
        "status": "VALID",
        "uploaded_at": now
    }

    existing_docs = application.get("documents", [])
    updated_docs = [d for d in existing_docs if d.get("document_code") != old_doc.get("document_type")]
    updated_docs.append(app_doc_entry)

    await db["applications"].update_one(
        {"_id": application_id},
        {"$set": {
            "documents": updated_docs,
            "status": "RESUBMITTED",
            "has_deficiency": False,
            "deficiency_notes": None,
            "updated_at": now
        }}
    )

    # 8. Record audit trail
    audit_entry = {
        "id": "AUD-" + uuid.uuid4().hex[:8].upper(),
        "timestamp": now,
        "actor": current_user.get("name", "Applicant"),
        "role": user_role or "APPLICANT",
        "action": "DOCUMENT_RESUBMITTED",
        "application_id": application_id,
        "document_id": new_doc_id,
        "remarks": f"Replacement document '{safe_filename}' uploaded for deficiency rectification (v{new_version}). Previous doc {document_id} superseded.",
        "ip_address": "127.0.0.1"
    }
    await db["audit_logs"].insert_one(audit_entry)

    return DocumentUploadResponse(
        document_id=new_doc_id,
        application_id=application_id,
        document_type=DocumentType(old_doc.get("document_type")),
        file_name=safe_filename,
        file_size_bytes=file_size,
        storage_path=storage_path,
        storage_key=storage_key,
        download_url=f"/api/documents/{new_doc_id}/file",
        message="Replacement document uploaded and old document safely archived.",
        uploaded_at=now
    )

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
        if doc.get("user_id") != user_id:
            app = await db["applications"].find_one({"_id": doc.get("application_id")})
            if not app or app.get("user_id") != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unauthorized: You do not have permission to access this document."
                )

    return serialize_document_metadata(doc)

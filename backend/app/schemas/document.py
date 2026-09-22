from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class DocumentType(str, Enum):
    ST_CERTIFICATE = "ST_CERTIFICATE"
    INCOME_CERTIFICATE = "INCOME_CERTIFICATE"
    MARKSHEET = "MARKSHEET"
    ADMISSION_PROOF = "ADMISSION_PROOF"
    BANK_DOCUMENT = "BANK_DOCUMENT"
    IDENTITY_DOCUMENT = "IDENTITY_DOCUMENT"

class DocumentMetadata(BaseModel):
    document_id: str
    application_id: str
    user_id: str
    document_type: DocumentType
    file_name: str
    file_size_bytes: int
    content_type: str
    storage_provider: str = "LOCAL_STORAGE" # Ready for S3 / MinIO
    storage_path: str
    status: str = "UPLOADED" # UPLOADED, OCR_VERIFIED, DEFICIENT
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class DocumentUploadResponse(BaseModel):
    document_id: str
    application_id: str
    document_type: DocumentType
    file_name: str
    file_size_bytes: int
    storage_path: str
    message: str = "Document metadata registered successfully."
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

from enum import Enum
from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field

class DocumentType(str, Enum):
    ST_CERTIFICATE = "ST_CERTIFICATE"
    INCOME_CERTIFICATE = "INCOME_CERTIFICATE"
    MARKSHEET = "MARKSHEET"
    ADMISSION_PROOF = "ADMISSION_PROOF"
    BANK_DOCUMENT = "BANK_DOCUMENT"
    IDENTITY_DOCUMENT = "IDENTITY_DOCUMENT"

class VerificationStatus(str, Enum):
    TYPE_MATCH = "TYPE_MATCH"
    TYPE_MISMATCH = "TYPE_MISMATCH"
    MANUAL_REVIEW = "MANUAL_REVIEW"
    LOW_QUALITY = "LOW_QUALITY"

class DocumentMetadata(BaseModel):
    document_id: str
    application_id: str
    user_id: str
    document_type: DocumentType
    file_name: str
    file_size_bytes: int
    content_type: str
    storage_provider: str = "LOCAL_STORAGE" # LOCAL_STORAGE or S3_MINIO_READY
    storage_path: str
    storage_key: Optional[str] = None
    status: str = "UPLOADED" # UPLOADED, PENDING_AI_VERIFICATION, OCR_VERIFIED, DEFICIENT, SUPERSEDED
    is_active: bool = True
    superseded_by: Optional[str] = None
    version: int = 1
    download_url: Optional[str] = None
    ocr_processed: bool = False
    detected_document_type: Optional[str] = None
    classification_confidence: Optional[float] = None
    verification_status: Optional[str] = None
    verification_message: Optional[str] = None
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
    storage_key: Optional[str] = None
    download_url: Optional[str] = None
    ocr_processed: bool = True
    detected_document_type: Optional[str] = None
    classification_confidence: Optional[float] = None
    verification_status: Optional[str] = None
    message: str = "Document uploaded, verified with OCR, and binary securely stored."
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentTypeVerificationResponse(BaseModel):
    success: bool
    required_document_type: str
    detected_document_type: Optional[str] = None
    match_status: VerificationStatus
    confidence: float
    message: str
    is_acceptable: bool
    character_count: int
    detected_keywords: List[str] = []
    extracted_fields: Dict[str, Optional[str]] = {}

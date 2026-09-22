from datetime import datetime
from pydantic import BaseModel, Field

class DocumentModel(BaseModel):
    id: str = Field(alias="_id")
    document_id: str
    application_id: str
    user_id: str
    document_type: str
    file_name: str
    file_size_bytes: int
    content_type: str
    storage_provider: str = "S3_MINIO_READY"
    storage_path: str
    status: str = "UPLOADED"
    created_at: datetime

    class Config:
        populate_by_name = True

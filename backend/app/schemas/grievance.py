from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class GrievanceStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    RESPONSE_REQUIRED = "RESPONSE_REQUIRED"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class GrievanceCreate(BaseModel):
    application_id: Optional[str] = None
    scheme_name: Optional[str] = None
    category: str = Field(..., example="DOCUMENT_DEFICIENCY")
    subject: str = Field(..., min_length=5, max_length=200, example="Clarification regarding renewed income certificate")
    description: str = Field(..., min_length=10, max_length=2000, example="The Tehsildar office is processing my certificate renewal...")

class GrievanceResponse(BaseModel):
    grievance_id: str
    user_id: str
    application_id: Optional[str] = None
    scheme_name: Optional[str] = None
    category: str
    subject: str
    description: str
    status: GrievanceStatus = GrievanceStatus.SUBMITTED
    assigned_officer: Optional[str] = "MoTA Redressal Officer"
    resolution_remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

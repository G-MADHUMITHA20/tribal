from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class ApplicationStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    RESUBMITTED = "RESUBMITTED"
    DOCUMENT_VERIFICATION = "DOCUMENT_VERIFICATION"
    ELIGIBILITY_VERIFICATION = "ELIGIBILITY_VERIFICATION"
    SCRUTINY = "SCRUTINY"
    SELECTION = "SELECTION"
    APPROVED = "APPROVED"
    DEFICIENT = "DEFICIENT"
    REJECTED = "REJECTED"

class PersonalDetails(BaseModel):
    full_name: str
    father_or_husband_name: Optional[str] = None
    gender: str = "FEMALE"
    dob: str
    aadhaar_masked: str
    category: str = "ST"
    tribe_community: str
    mobile: str
    email: str
    state: str
    district: str
    pincode: str

class AcademicDetails(BaseModel):
    current_course: str
    institution_name: str
    institution_state: Optional[str] = None
    aishe_code: Optional[str] = None
    roll_number: Optional[str] = None
    year_of_study: Optional[str] = None
    previous_exam_name: str
    previous_exam_percentage: float
    passing_year: str
    board_or_university: str

class FinancialDetails(BaseModel):
    annual_family_income: int
    bank_name: str
    account_holder_name: str
    account_number_masked: str
    ifsc_code: str
    branch_name: Optional[str] = None
    is_aadhaar_seeded: bool = True

class ApplicationDocumentItem(BaseModel):
    id: str
    document_code: str
    document_name: str
    file_name: str
    file_url: Optional[str] = None
    file_size_kb: Optional[int] = None
    status: str = "PENDING"
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class ApplicationCreate(BaseModel):
    scheme_id: str
    personal_details: PersonalDetails
    academic_details: AcademicDetails
    financial_details: FinancialDetails
    documents: Optional[List[ApplicationDocumentItem]] = []
    status: ApplicationStatus = ApplicationStatus.SUBMITTED

class ApplicationUpdate(BaseModel):
    personal_details: Optional[PersonalDetails] = None
    academic_details: Optional[AcademicDetails] = None
    financial_details: Optional[FinancialDetails] = None
    documents: Optional[List[ApplicationDocumentItem]] = None
    status: Optional[ApplicationStatus] = None

class ApplicationResponse(BaseModel):
    application_id: str
    user_id: str
    scheme_id: str
    scheme_name: Optional[str] = None
    status: ApplicationStatus
    personal_details: PersonalDetails
    academic_details: AcademicDetails
    financial_details: FinancialDetails
    documents: List[ApplicationDocumentItem] = []
    has_deficiency: bool = False
    deficiency_notes: Optional[str] = None
    officer_remarks: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

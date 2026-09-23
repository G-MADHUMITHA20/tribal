from enum import Enum
from typing import List, Optional, Any, Union
from pydantic import BaseModel, Field

class SchemeCategory(str, Enum):
    PRE_MATRIC = "PRE_MATRIC"
    POST_MATRIC = "POST_MATRIC"
    NATIONAL_SCHOLARSHIP = "NATIONAL_SCHOLARSHIP"
    NATIONAL_FELLOWSHIP = "NATIONAL_FELLOWSHIP"
    NATIONAL_OVERSEAS = "NATIONAL_OVERSEAS"
    DBT = "DBT"

class EligibilityCriterion(BaseModel):
    id: str
    field: str
    label: str
    operator: str
    value: Union[str, int, float, bool, List[str]]
    explanation: str

class RequiredDocument(BaseModel):
    id: str
    code: str
    name: str
    description: str
    required: bool = True

class BenefitTier(BaseModel):
    item: str
    amount: str
    frequency: str
    notes: Optional[str] = None

class SchemeResponse(BaseModel):
    id: str
    code: str
    name: str
    short_name: str
    category: SchemeCategory
    tagline: str
    description: str
    portal_category: str
    is_open: bool
    academic_year: str
    application_deadline: str
    target_community: str = "Scheduled Tribes (ST)"
    annual_income_cap: int
    min_academic_percentage: Optional[float] = None
    eligibility_summary: List[str]
    eligibility_rules: List[EligibilityCriterion]
    required_documents: List[RequiredDocument]
    benefits: List[BenefitTier]
    is_demo_data: bool = True

    class Config:
        from_attributes = True

class SchemeCreate(BaseModel):
    id: Optional[str] = None
    code: str
    name: str
    short_name: str
    category: SchemeCategory
    tagline: str
    description: str
    portal_category: Optional[str] = "MoTA Direct Portal"
    is_open: bool = True
    academic_year: Optional[str] = "2025-26"
    application_deadline: str
    target_community: str = "Scheduled Tribes (ST)"
    annual_income_cap: int = 0
    min_academic_percentage: Optional[float] = None
    eligibility_summary: Optional[List[str]] = []
    eligibility_rules: Optional[List[EligibilityCriterion]] = []
    required_documents: Optional[List[RequiredDocument]] = []
    benefits: Optional[List[BenefitTier]] = []
    is_demo_data: bool = False

class SchemeUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    category: Optional[SchemeCategory] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    portal_category: Optional[str] = None
    is_open: Optional[bool] = None
    academic_year: Optional[str] = None
    application_deadline: Optional[str] = None
    target_community: Optional[str] = None
    annual_income_cap: Optional[int] = None
    min_academic_percentage: Optional[float] = None
    eligibility_summary: Optional[List[str]] = None
    eligibility_rules: Optional[List[EligibilityCriterion]] = None
    required_documents: Optional[List[RequiredDocument]] = None
    benefits: Optional[List[BenefitTier]] = None
    is_demo_data: Optional[bool] = None


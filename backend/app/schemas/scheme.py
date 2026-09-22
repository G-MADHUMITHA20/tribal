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

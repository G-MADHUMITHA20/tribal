"""
TSFMS Document Classification and Signature Verification Engine.
Implements rule-based heuristics and weighted signature matching to classify
citizen documents into statutory categories (ST Certificate, Income Certificate,
Marksheet, Bank Passbook, Admission Proof, Identity Document) without relying on external LLMs.
"""

import re
from typing import Dict, List, Optional, Tuple, Any
from app.schemas.document import DocumentType

# Classification weights and signature patterns
CLASSIFICATION_RULES: Dict[str, Dict[str, Any]] = {
    DocumentType.ST_CERTIFICATE.value: {
        "display_name": "ST Community / Caste Certificate",
        "primary_signatures": [
            r"\bscheduled\s+tribe\b",
            r"\bcaste\s+certificate\b",
            r"\bcommunity\s+certificate\b",
            r"\bpresidential\s+order\b",
            r"\bconstitution\s*\(?\s*scheduled\s+tribes\s*\)?\s*order\b",
            r"\barticle\s+342\b",
            r"\btribal\s+community\b",
            r"\bnotified\s+scheduled\s+tribe\b",
            r"\bbelongs\s+to\s+the\s+[a-zA-Z\s]+\s+community\b",
        ],
        "secondary_signatures": [
            r"\btehsildar\b",
            r"\bsub[- ]divisional\s+(?:officer|magistrate)\b",
            r"\bdistrict\s+magistrate\b",
            r"\brevenue\s+authority\b",
            r"\badivasi\b",
            r"\bcaste\b",
            r"\btribe\b",
            r"\bcertificate\s+no\.?\b",
        ],
        "negative_signatures": [
            r"\bannual\s+family\s+income\b",
            r"\bgross\s+annual\s+income\b",
            r"\bstatement\s+of\s+marks\b",
            r"\bmarksheet\b",
            r"\bifsc\s+code\b",
            r"\bbank\s+passbook\b",
            r"\bsavings\s+bank\s+account\b",
        ],
        "min_confidence_threshold": 0.40,
        "high_confidence_threshold": 0.70,
    },
    DocumentType.INCOME_CERTIFICATE.value: {
        "display_name": "Income Certificate",
        "primary_signatures": [
            r"\bincome\s+certificate\b",
            r"\bannual\s+(?:family\s+)?income\b",
            r"\bgross\s+annual\s+income\b",
            r"\btotal\s+annual\s+income\b",
            r"\bincome\s+from\s+all\s+sources\b",
            r"\bper\s+annum\b",
            r"\bannual\s+income\s+of\s+rs\b",
            r"\bcertified\s+that\s+(?:the\s+)?annual\s+income\b",
        ],
        "secondary_signatures": [
            r"\brevenue\s+department\b",
            r"\btehsildar\b",
            r"\bcircle\s+officer\b",
            r"\bpatwari\b",
            r"\bassessment\s+year\b",
            r"\bfinancial\s+year\b",
            r"\brupees\s+(?:only|lakh)\b",
            r"\bfy\s*20\d\d[-/]\d\d\b",
        ],
        "negative_signatures": [
            r"\bpresidential\s+order\b",
            r"\bconstitution\s*\(?\s*scheduled\s+tribes\s*\)?\b",
            r"\bstatement\s+of\s+marks\b",
            r"\bmarksheet\b",
            r"\bifsc\s+code\b",
            r"\bbank\s+passbook\b",
        ],
        "min_confidence_threshold": 0.40,
        "high_confidence_threshold": 0.70,
    },
    DocumentType.MARKSHEET.value: {
        "display_name": "Qualifying Marksheet",
        "primary_signatures": [
            r"\bstatement\s+of\s+marks\b",
            r"\bmarksheet\b",
            r"\bgrade\s+card\b",
            r"\bexamination\s+results?\b",
            r"\bmarks\s+obtained\b",
            r"\bmaximum\s+marks\b",
            r"\bpercentage\s+of\s+marks\b",
            r"\baggregate\s+marks\b",
            r"\bboard\s+of\s+(?:secondary|higher\s+secondary)\b",
        ],
        "secondary_signatures": [
            r"\bsemester\b",
            r"\broll\s+(?:no|number)\b",
            r"\bpassing\s+year\b",
            r"\bacademic\s+session\b",
            r"\buniversity\b",
            r"\bcgpa\b",
            r"\bsubject\s+(?:code|name)\b",
            r"\bgrand\s+total\b",
        ],
        "negative_signatures": [
            r"\bcaste\s+certificate\b",
            r"\bpresidential\s+order\b",
            r"\bannual\s+family\s+income\b",
            r"\bifsc\s+code\b",
            r"\bbank\s+passbook\b",
        ],
        "min_confidence_threshold": 0.40,
        "high_confidence_threshold": 0.70,
    },
    DocumentType.BANK_DOCUMENT.value: {
        "display_name": "Bank Passbook / Account Document",
        "primary_signatures": [
            r"\bbank\s+passbook\b",
            r"\bsavings\s+bank\s+account\b",
            r"\baccount\s+number\b",
            r"\bifsc\s*(?:code)?\b",
            r"\bmicr\s*(?:code)?\b",
            r"\bbranch\s+name\b",
            r"\baccount\s+holder\b",
            r"\bstate\s+bank\s+of\s+india\b",
            r"\bcanara\s+bank\b",
            r"\bbank\s+of\s+baroda\b",
            r"\bpunjab\s+national\s+bank\b",
        ],
        "secondary_signatures": [
            r"\bcustomer\s+id\b",
            r"\bcif\s+no\.?\b",
            r"\bdbt\s+(?:enabled|seeded)\b",
            r"\baadhaar\s+seeding\b",
            r"\bopening\s+date\b",
            r"\bclear\s+balance\b",
        ],
        "negative_signatures": [
            r"\bcaste\s+certificate\b",
            r"\bscheduled\s+tribe\b",
            r"\bpresidential\s+order\b",
            r"\bstatement\s+of\s+marks\b",
            r"\bmarksheet\b",
        ],
        "min_confidence_threshold": 0.40,
        "high_confidence_threshold": 0.70,
    },
    DocumentType.ADMISSION_PROOF.value: {
        "display_name": "University Admission Letter",
        "primary_signatures": [
            r"\badmission\s+letter\b",
            r"\bprovisional\s+admission\b",
            r"\ballotment\s+letter\b",
            r"\bjoining\s+report\b",
            r"\bbonafide\s+certificate\b",
            r"\bcourse\s+of\s+study\b",
            r"\badmitted\s+to\s+the\s+course\b",
        ],
        "secondary_signatures": [
            r"\benrolment\s+number\b",
            r"\bdepartment\s+of\b",
            r"\binstitution\b",
            r"\bhead\s+of\s+department\b",
            r"\bfees\s+paid\b",
            r"\bacademic\s+session\b",
        ],
        "negative_signatures": [
            r"\bincome\s+certificate\b",
            r"\bcaste\s+certificate\b",
            r"\bbank\s+passbook\b",
        ],
        "min_confidence_threshold": 0.40,
        "high_confidence_threshold": 0.70,
    },
    DocumentType.IDENTITY_DOCUMENT.value: {
        "display_name": "Aadhaar / Identity Document",
        "primary_signatures": [
            r"\bunique\s+identification\s+authority\b",
            r"\buidai\b",
            r"\baadhaar\b",
            r"\bmera\s+aadhaar\b",
            r"\bgovernment\s+of\s+india\b",
        ],
        "secondary_signatures": [
            r"\benrollment\s+no\.?\b",
            r"\bvid\b",
            r"\bhelp@uidai\.gov\.in\b",
            r"\bdate\s+of\s+birth\b",
        ],
        "negative_signatures": [
            r"\bstatement\s+of\s+marks\b",
            r"\bincome\s+certificate\b",
        ],
        "min_confidence_threshold": 0.40,
        "high_confidence_threshold": 0.70,
    }
}

# Alias mapping for frontend scheme codes
DOCUMENT_CODE_ALIASES: Dict[str, str] = {
    "DOC_ST_CERT": DocumentType.ST_CERTIFICATE.value,
    "ST": DocumentType.ST_CERTIFICATE.value,
    "ST_CERTIFICATE": DocumentType.ST_CERTIFICATE.value,
    "DOC_INC_CERT": DocumentType.INCOME_CERTIFICATE.value,
    "INC": DocumentType.INCOME_CERTIFICATE.value,
    "INCOME_CERTIFICATE": DocumentType.INCOME_CERTIFICATE.value,
    "DOC_PREV_MARKSHEET": DocumentType.MARKSHEET.value,
    "MARK": DocumentType.MARKSHEET.value,
    "MARKSHEET": DocumentType.MARKSHEET.value,
    "DOC_BANK_PASSBOOK": DocumentType.BANK_DOCUMENT.value,
    "BANK": DocumentType.BANK_DOCUMENT.value,
    "BANK_PASSBOOK": DocumentType.BANK_DOCUMENT.value,
    "BANK_DOCUMENT": DocumentType.BANK_DOCUMENT.value,
    "DOC_ADMISSION_PROOF": DocumentType.ADMISSION_PROOF.value,
    "ADM": DocumentType.ADMISSION_PROOF.value,
    "ADMISSION_PROOF": DocumentType.ADMISSION_PROOF.value,
    "ADMISSION_LETTER": DocumentType.ADMISSION_PROOF.value,
    "DOC_AADHAAR": DocumentType.IDENTITY_DOCUMENT.value,
    "AADHAAR": DocumentType.IDENTITY_DOCUMENT.value,
    "IDENTITY_DOCUMENT": DocumentType.IDENTITY_DOCUMENT.value,
}

def normalize_document_type(raw_type: str) -> str:
    """Normalize any frontend or scheme document code into canonical DocumentType value."""
    key = raw_type.upper().strip()
    return DOCUMENT_CODE_ALIASES.get(key, key)

def classify_document_text(text: str, required_type: str) -> Dict[str, Any]:
    """
    Score the extracted document text against all document classification rules.
    Detects the best matching document type, assesses confidence, and compares
    with the statutory required document type.
    """
    norm_required = normalize_document_type(required_type)
    cleaned_text = text.lower()
    char_count = len(text.strip())

    # Step 1: Detect poor scan or low text yield
    if char_count < 20:
        return {
            "match_status": "LOW_QUALITY",
            "detected_type": None,
            "required_type": norm_required,
            "confidence": 0.0,
            "is_acceptable": False,
            "message": "Unable to confidently read this document. Text yield is too low (< 20 characters). Please upload a clearer scan or PDF.",
            "char_count": char_count,
            "scores": {}
        }

    scores: Dict[str, float] = {}
    matched_keywords: Dict[str, List[str]] = {}

    for doc_type, rules in CLASSIFICATION_RULES.items():
        score = 0.0
        kw_list: List[str] = []

        # Primary signatures (weight 0.40 each, max contribution 0.70)
        primary_hits = 0
        for pattern in rules["primary_signatures"]:
            if re.search(pattern, cleaned_text, re.IGNORECASE):
                primary_hits += 1
                clean_term = pattern.replace(r"\b", "").replace(r"\s+", " ").replace("\\", "")
                kw_list.append(clean_term)
        score += min(primary_hits * 0.35, 0.70)

        # Secondary signatures (weight 0.15 each, max contribution 0.30)
        sec_hits = 0
        for pattern in rules["secondary_signatures"]:
            if re.search(pattern, cleaned_text, re.IGNORECASE):
                sec_hits += 1
                clean_term = pattern.replace(r"\b", "").replace(r"\s+", " ").replace("\\", "")
                kw_list.append(clean_term)
        score += min(sec_hits * 0.15, 0.30)

        # Negative signatures penalty (reduces confidence by up to 0.40)
        neg_hits = 0
        for pattern in rules["negative_signatures"]:
            if re.search(pattern, cleaned_text, re.IGNORECASE):
                neg_hits += 1
        score = max(0.0, score - (neg_hits * 0.25))

        scores[doc_type] = round(min(score, 1.0), 2)
        matched_keywords[doc_type] = kw_list

    # Find the top detected type
    best_doc_type = max(scores, key=lambda k: scores[k])
    best_score = scores[best_doc_type]
    required_score = scores.get(norm_required, 0.0)

    required_display = CLASSIFICATION_RULES.get(norm_required, {}).get("display_name", norm_required)
    detected_display = CLASSIFICATION_RULES.get(best_doc_type, {}).get("display_name", best_doc_type)

    # Decision Matrix:
    # 1. Clear Match: required type has high confidence
    if required_score >= 0.65 or (best_doc_type == norm_required and best_score >= 0.40):
        confidence = max(required_score, best_score)
        return {
            "match_status": "TYPE_MATCH",
            "detected_type": norm_required,
            "required_type": norm_required,
            "confidence": confidence,
            "is_acceptable": True,
            "message": f"Document type matches: {required_display} verified ({int(confidence * 100)}% confidence).",
            "char_count": char_count,
            "matched_keywords": matched_keywords.get(norm_required, []),
            "scores": scores
        }

    # 2. Clear Mismatch: Another type is strongly detected with >= 0.50 confidence
    if best_score >= 0.50 and best_doc_type != norm_required:
        return {
            "match_status": "TYPE_MISMATCH",
            "detected_type": best_doc_type,
            "required_type": norm_required,
            "confidence": best_score,
            "is_acceptable": False,
            "message": f"Uploaded document appears to be a {detected_display} ({int(best_score * 100)}% confidence), but scheme requires {required_display}. Please upload the correct document.",
            "char_count": char_count,
            "matched_keywords": matched_keywords.get(best_doc_type, []),
            "scores": scores
        }

    # 3. Moderate Confidence: Partial match on required type (flag for manual review)
    if required_score >= 0.30:
        return {
            "match_status": "MANUAL_REVIEW",
            "detected_type": norm_required,
            "required_type": norm_required,
            "confidence": required_score,
            "is_acceptable": True,
            "message": f"Document partially identified as {required_display} ({int(required_score * 100)}% confidence). Flagged for manual review by verification officer.",
            "char_count": char_count,
            "matched_keywords": matched_keywords.get(norm_required, []),
            "scores": scores
        }

    # 4. Low Quality / Ambiguous
    return {
        "match_status": "LOW_QUALITY",
        "detected_type": None,
        "required_type": norm_required,
        "confidence": best_score,
        "is_acceptable": False,
        "message": f"Unable to confidently read or classify this document ({int(best_score * 100)}% confidence). Please upload a clearer scan of your {required_display}.",
        "char_count": char_count,
        "matched_keywords": [],
        "scores": scores
    }

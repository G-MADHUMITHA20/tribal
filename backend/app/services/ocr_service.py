"""
TSFMS Real OCR & Text Extraction Engine.
Extracts text from digital PDFs via pypdf and from raster images/scanned documents
using RapidOCR (ONNX runtime) and Pillow without external system binaries or paid cloud APIs.
Protects sensitive personal information: strictly avoids logging plaintext document data.
"""

import io
import re
import logging
from typing import Dict, Any, Optional, Tuple
import numpy as np
from PIL import Image
import pypdf

from app.services.document_classifier import classify_document_text, normalize_document_type

logger = logging.getLogger("tsfms.ocr")

# Lazy-loaded RapidOCR engine instance
_rapid_ocr_instance = None

def get_ocr_engine():
    global _rapid_ocr_instance
    if _rapid_ocr_instance is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
            _rapid_ocr_instance = RapidOCR()
            logger.info("RapidOCR ONNX Runtime engine initialized.")
        except Exception as e:
            logger.warning(f"Could not initialize RapidOCR: {e}")
            _rapid_ocr_instance = False
    return _rapid_ocr_instance

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text streams from PDF pages using pypdf.
    If digital text yields < 30 characters (scanned PDF), attempts embedded image OCR.
    """
    extracted_text = ""
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            t = page.extract_text() or ""
            extracted_text += t + "\n"

        extracted_text = extracted_text.strip()
        # If sufficient digital text extracted, return directly
        if len(extracted_text) >= 30:
            return extracted_text

        # Fallback: Check if PDF contains scanned image pages
        ocr_engine = get_ocr_engine()
        if ocr_engine:
            image_text = ""
            for page in reader.pages:
                for img_obj in page.images:
                    try:
                        pil_img = Image.open(io.BytesIO(img_obj.data)).convert("RGB")
                        img_np = np.array(pil_img)
                        ocr_result, _ = ocr_engine(img_np)
                        if ocr_result:
                            image_text += " ".join([box[1] for box in ocr_result]) + "\n"
                    except Exception:
                        continue
            if len(image_text.strip()) > len(extracted_text):
                return image_text.strip()

        return extracted_text
    except Exception as e:
        logger.warning(f"PDF extraction encountered error: {e}")
        return ""

def extract_text_from_image(file_bytes: bytes) -> str:
    """
    Extract text from image files (JPEG, PNG) using RapidOCR.
    Applies Pillow preprocessing for optimal contrast and OCR yield.
    """
    ocr_engine = get_ocr_engine()
    if not ocr_engine:
        return ""

    try:
        pil_img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        # Ensure image has sufficient resolution (upscale small scans)
        w, h = pil_img.size
        if w < 600 or h < 600:
            scale = max(2, 800 // max(w, 1))
            pil_img = pil_img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)

        img_np = np.array(pil_img)
        ocr_result, _ = ocr_engine(img_np)

        if not ocr_result:
            return ""

        extracted_lines = [box[1] for box in ocr_result if box and len(box) >= 2]
        return "\n".join(extracted_lines).strip()
    except Exception as e:
        logger.warning(f"Image OCR extraction error: {e}")
        return ""

def extract_non_sensitive_fields(text: str, doc_type: str) -> Dict[str, Optional[str]]:
    """
    Extract benign administrative fields (certificate number, issuing authority,
    financial year, date) without logging or exposing sensitive PII.
    """
    fields: Dict[str, Optional[str]] = {
        "certificate_number": None,
        "issuing_authority": None,
        "financial_year": None,
        "issue_date": None,
    }

    # Certificate Number regex
    cert_match = re.search(r"(?:cert(?:ificate)?|ref|sl|application)\s*(?:no|number|num)?[:.\s]+([A-Z0-9/\-_]{4,35})", text, re.IGNORECASE)
    if cert_match:
        fields["certificate_number"] = cert_match.group(1).strip()

    # Issuing Authority regex
    authorities = [
        "Office of the Tehsildar",
        "Sub-Divisional Magistrate",
        "Sub-Divisional Officer",
        "Circle Officer",
        "District Magistrate",
        "Deputy Commissioner",
        "Revenue Department",
        "Board of Secondary Education",
        "State Bank of India",
        "Office of the Headmaster",
    ]
    for auth in authorities:
        if re.search(re.escape(auth), text, re.IGNORECASE):
            fields["issuing_authority"] = auth
            break

    # Financial Year regex
    fy_match = re.search(r"\b(?:FY|Financial\s+Year|AY)\s*[:.\s]*((?:20\d\d[-/]\d\d)|(?:20\d\d[-/]\d\d\d\d))\b", text, re.IGNORECASE)
    if fy_match:
        fields["financial_year"] = fy_match.group(1).strip()

    # Issue Date regex
    date_match = re.search(r"\b([0-3]?[0-9][-/][0-1]?[0-9][-/]20\d\d)\b", text)
    if date_match:
        fields["issue_date"] = date_match.group(1).strip()

    return fields

def verify_document_content(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    required_document_type: str
) -> Dict[str, Any]:
    """
    Main entry point for real document OCR and type verification:
    1. Extracts text from PDF or image using genuine local OCR engine.
    2. Runs rule-based classifier against statutory scheme document categories.
    3. Extracts safe, non-sensitive metadata fields.
    4. Evaluates match against the required document type.
    """
    norm_required = normalize_document_type(required_document_type)

    # 1. Text Extraction
    is_pdf = content_type.lower() == "application/pdf" or filename.lower().endswith(".pdf")
    if is_pdf:
        extracted_text = extract_text_from_pdf(file_bytes)
    else:
        extracted_text = extract_text_from_image(file_bytes)

    # 2. Document Classification
    classification = classify_document_text(extracted_text, norm_required)

    # 3. Extract Benign Metadata Fields
    fields = extract_non_sensitive_fields(extracted_text, norm_required)

    return {
        "success": True,
        "required_document_type": norm_required,
        "detected_document_type": classification["detected_type"],
        "match_status": classification["match_status"],
        "confidence": classification["confidence"],
        "message": classification["message"],
        "is_acceptable": classification["is_acceptable"],
        "character_count": classification["char_count"],
        "detected_keywords": classification.get("matched_keywords", []),
        "extracted_fields": fields
    }

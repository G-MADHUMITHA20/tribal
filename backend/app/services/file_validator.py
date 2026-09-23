import re
from typing import Tuple
from fastapi import HTTPException, status

# Statutory limit: 5 MB per document
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

# Allowed MIME types and corresponding extensions
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
}

# Magic byte signatures for genuine binary content validation
MAGIC_SIGNATURES = [
    (b"%PDF-", "application/pdf"),
    (b"\xff\xd8\xff", "image/jpeg"),
    (b"\x89PNG\r\n\x1a\n", "image/png"),
]

def sanitize_filename(filename: str) -> str:
    """
    Remove path traversal sequences, whitespace, and special characters.
    """
    # Strip any directory components
    cleaned = filename.replace("\\", "/").split("/")[-1]
    # Replace non-alphanumeric (except dots, underscores, dashes)
    cleaned = re.sub(r"[^a-zA-Z0-9._-]", "_", cleaned)
    # Prevent hidden files
    cleaned = cleaned.lstrip(".")
    if not cleaned:
        cleaned = "document.pdf"
    return cleaned

def validate_uploaded_file(file_bytes: bytes, filename: str, content_type: str) -> Tuple[str, str]:
    """
    Perform rigorous server-side validation on uploaded document:
    1. Check non-empty
    2. Check max file size (5MB)
    3. Check filename extension
    4. Check MIME type header
    5. Verify real magic bytes to prevent MIME spoofing / executable masquerading

    Returns (sanitized_filename, validated_content_type)
    """
    # 1. Non-empty check
    if not file_bytes or len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid upload: The submitted file is empty (0 bytes)."
        )

    # 2. Maximum file size check
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum permissible size of 5 MB ({len(file_bytes)} bytes provided)."
        )

    # 3. Filename sanitization and extension check
    safe_filename = sanitize_filename(filename)
    extension = "." + safe_filename.split(".")[-1].lower() if "." in safe_filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{extension}'. Only PDF, JPEG, and PNG files are accepted."
        )

    # 4. MIME type check
    normalized_mime = (content_type or "").lower().strip()
    if normalized_mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported content type '{content_type}'. Must be application/pdf, image/jpeg, or image/png."
        )

    # 5. Magic byte verification (content sniffing)
    matched_type = None
    for magic, mime in MAGIC_SIGNATURES:
        if file_bytes.startswith(magic):
            matched_type = mime
            break

    if not matched_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content does not match genuine PDF or image binary signatures. Corrupted or disguised file rejected."
        )

    # Check extension matches magic bytes
    if matched_type == "application/pdf" and extension != ".pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File extension does not match PDF content signature."
        )
    if matched_type in ("image/jpeg", "image/png") and extension not in (".jpg", ".jpeg", ".png"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File extension does not match image content signature."
        )

    return safe_filename, matched_type

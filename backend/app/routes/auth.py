import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError
from app.database.mongodb import get_database
from app.core.security import hash_password, verify_password, create_access_token, get_current_user_payload
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse, UserRole
from app.services.identity_validator import validate_phone, normalize_phone

logger = logging.getLogger("tsfms.auth")
router = APIRouter(prefix="/auth", tags=["Authentication"])

async def ensure_user_indexes(db: AsyncIOMotorDatabase):
    """
    Ensure database-level unique indexes on users collection for email and phone numbers.
    Phone is mandatory in the User schema; enforces a standard unique index.
    Upgrades any legacy sparse phone index to standard unique index automatically.
    """
    try:
        # Enforce unique index on email
        await db["users"].create_index("email", unique=True)

        # Check existing indexes on users to cleanly upgrade legacy sparse phone index if present
        existing_indexes = await db["users"].list_indexes().to_list(100)
        for idx in existing_indexes:
            if idx.get("name") == "phone_1" and idx.get("sparse") is True:
                logger.info("Migrating legacy sparse phone index to standard unique index...")
                await db["users"].drop_index("phone_1")
                break

        # Enforce unique index on phone
        await db["users"].create_index("phone", unique=True)
        logger.info("Database unique indexes verified on 'users' collection: email (unique), phone (unique).")
    except Exception as e:
        logger.error("Failed ensuring unique indexes on 'users' collection: %s", str(e))

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Register a new applicant citizen with hashed credentials.
    Enforces strict email and phone normalization, application-level uniqueness,
    and database-level duplicate-key race condition handling (HTTP 409).
    Never stores plain-text passwords.
    """
    clean_email = user_in.email.strip().lower()
    clean_phone = validate_phone(user_in.phone)

    # Application-level pre-checks for friendly, specific duplicate messaging
    existing_email = await db["users"].find_one({"email": clean_email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    existing_phone = await db["users"].find_one({"phone": clean_phone})
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this phone number already exists."
        )

    # Securely hash password using bcrypt
    hashed_pwd = hash_password(user_in.password)
    user_id = "USR-" + uuid.uuid4().hex[:8].upper()
    now = datetime.now(timezone.utc)

    user_doc = {
        "_id": user_id,
        "name": user_in.name.strip(),
        "email": clean_email,
        "phone": clean_phone,
        "hashed_password": hashed_pwd,
        "role": user_in.role.value if user_in.role else UserRole.APPLICANT.value,
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }

    try:
        await db["users"].insert_one(user_doc)
    except DuplicateKeyError as dke:
        # Robust inspection of keyPattern and string representation
        key_pattern = getattr(dke, "details", {}).get("keyPattern", {}) if hasattr(dke, "details") and isinstance(dke.details, dict) else {}
        err_msg = str(dke).lower()
        if "phone" in key_pattern or "phone" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this phone number already exists."
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    # Generate JWT access token
    access_token = create_access_token(data={
        "sub": user_id,
        "email": user_doc["email"],
        "role": user_doc["role"],
        "name": user_doc["name"]
    })

    user_response = UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=user_doc["email"],
        phone=user_doc["phone"],
        role=UserRole(user_doc["role"]),
        created_at=user_doc["created_at"],
        is_active=user_doc["is_active"]
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Authenticate citizen credentials and issue JWT access token.
    Uses identical email normalization (strip and lower).
    """
    clean_email = credentials.email.strip().lower()
    user = await db["users"].find_one({"email": clean_email})
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Citizen account is currently deactivated. Contact helpdesk."
        )

    access_token = create_access_token(data={
        "sub": user["_id"],
        "email": user["email"],
        "role": user["role"],
        "name": user["name"]
    })

    user_response = UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        phone=user.get("phone", ""),
        role=UserRole(user.get("role", UserRole.APPLICANT.value)),
        created_at=user.get("created_at", datetime.now(timezone.utc)),
        is_active=user.get("is_active", True)
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.get("/me", response_model=UserResponse)
async def get_me(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Retrieve profile details of the authenticated citizen / officer.
    """
    user_id = payload.get("sub")
    user = await db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found."
        )

    return UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        phone=user.get("phone", ""),
        role=UserRole(user.get("role", UserRole.APPLICANT.value)),
        created_at=user.get("created_at", datetime.now(timezone.utc)),
        is_active=user.get("is_active", True)
    )

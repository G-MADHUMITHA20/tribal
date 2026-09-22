import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database
from app.core.security import hash_password, verify_password, create_access_token, get_current_user_payload
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse, UserRole

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Register a new applicant citizen with hashed credentials.
    Never stores plain-text passwords.
    """
    # Check if user already exists
    existing_user = await db["users"].find_one({"email": user_in.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A citizen profile with this email address already exists in the system."
        )

    # Securely hash password using bcrypt
    hashed_pwd = hash_password(user_in.password)
    user_id = "USR-" + uuid.uuid4().hex[:8].upper()
    now = datetime.now(timezone.utc)

    user_doc = {
        "_id": user_id,
        "name": user_in.name,
        "email": user_in.email.lower(),
        "phone": user_in.phone,
        "hashed_password": hashed_pwd,
        "role": user_in.role.value if user_in.role else UserRole.APPLICANT.value,
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }

    await db["users"].insert_one(user_doc)

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
    """
    user = await db["users"].find_one({"email": credentials.email.lower()})
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

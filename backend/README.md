# MoTA TSFMS - Backend Foundation
### Unified AI-Enabled Scholarship & Fellowship Management System
**Ministry of Tribal Affairs, Government of India**

---

## 1. Overview & Architecture

This repository contains the backend service for the Unified Scholarship & Fellowship Management System (TSFMS). It provides the core API foundation for citizen authentication, scheme discovery, multi-stage application filing, document metadata tracking, and grievance redressal.

### Technology Stack
- **Framework**: Python 3.10+ / FastAPI
- **Database**: MongoDB (via Motor async driver & PyMongo)
- **Validation**: Pydantic v2
- **Security**: JWT (HS256) & bcrypt password hashing
- **Environment**: python-dotenv & pydantic-settings
- **Documentation**: Swagger UI (`/docs`) & OpenAPI 3.0 (`/openapi.json`)

---

## 2. Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI entrypoint, lifespan, CORS, health checks
│   │
│   ├── core/
│   │   ├── config.py            # Environment validation & settings
│   │   └── security.py          # Bcrypt hashing & JWT token verification
│   │
│   ├── database/
│   │   ├── mongodb.py           # Motor async database manager & connection pool
│   │   └── seed_data.py         # Seed dataset for 6 MoTA flagship schemes
│   │
│   ├── models/                  # Database entity structures
│   │   ├── user.py
│   │   ├── scheme.py
│   │   ├── application.py
│   │   ├── document.py
│   │   └── grievance.py
│   │
│   ├── schemas/                 # Pydantic request/response models
│   │   ├── user.py              # UserRegister, UserLogin, UserResponse
│   │   ├── scheme.py            # SchemeResponse, EligibilityCriterion
│   │   ├── application.py       # ApplicationCreate, ApplicationResponse
│   │   ├── document.py          # DocumentType, DocumentUploadResponse
│   │   └── grievance.py         # GrievanceCreate, GrievanceResponse
│   │
│   ├── routes/                  # API Sub-routers
│   │   ├── auth.py              # /api/auth (register, login, me)
│   │   ├── schemes.py           # /api/schemes (list, get by id)
│   │   ├── applications.py      # /api/applications (create, my, get, update)
│   │   ├── documents.py         # /api/documents (upload, by application)
│   │   └── grievances.py        # /api/grievances (lodge, my)
│   │
│   └── services/
│       └── application_service.py # ID generation & database initialization
│
├── .env                         # Local secrets (Ignored in Git)
├── .env.example                 # Environment template
├── .gitignore                   # Excludes .env, .venv, pycache
├── requirements.txt             # Python dependencies
└── README.md                    # Documentation & run instructions
```

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configured variables:
```ini
# MongoDB Connection String (Atlas cluster or local instance)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tsfms
MONGO_DB_NAME=tsfms

# JWT Secret & Algorithm
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Allowed CORS origins
CORS_ORIGINS=http://localhost:5173
```

> [!IMPORTANT]
> - Never commit `backend/.env` to source control.
> - Never expose `MONGO_URI` to the React frontend.
> - The application will refuse to start with an explicit configuration error if `MONGO_URI` is missing.

---

## 4. How to Run the Backend

### Prerequisites
- Python 3.10+
- Virtual environment tool (`venv`)

### Installation & Execution
```bash
# 1. Navigate to backend directory
cd backend

# 2. Activate virtual environment
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Launch FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Server endpoints will be active on:
- API Base: `http://localhost:8000/api`
- Interactive Swagger Docs: `http://localhost:8000/docs`
- OpenAPI Specification: `http://localhost:8000/openapi.json`

---

## 5. API Endpoints Reference

### System Health
- `GET /api/health` - Basic service liveness check (`{"status": "ok"}`)
- `GET /api/health/db` - Verifies active MongoDB connectivity

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Citizen registration (hashes password with bcrypt)
- `POST /api/auth/login` - Returns JWT access token
- `GET /api/auth/me` - Authenticated user profile

### Schemes (`/api/schemes`)
- `GET /api/schemes` - Lists all 6 configured MoTA schemes
- `GET /api/schemes/{scheme_id}` - Detailed statutory rules & benefits for a scheme

### Applications (`/api/applications`)
- `POST /api/applications` - Submit scholarship application
- `GET /api/applications/my` - List applicant's submitted dossiers
- `GET /api/applications/{application_id}` - Retrieve dossier details
- `PUT /api/applications/{application_id}` - Update application or rectify deficiency

### Documents (`/api/documents`)
- `POST /api/documents/upload` - Register document metadata (S3/MinIO ready)
- `GET /api/documents/application/{application_id}` - List documents for an application

### Grievances (`/api/grievances`)
- `POST /api/grievances` - Lodge a grievance ticket
- `GET /api/grievances/my` - Track filed grievances

---

## 6. Frontend Integration

In the React frontend, configure `.env`:
```ini
VITE_API_BASE_URL=http://localhost:8000/api
```

Use `src/services/api.ts` to consume backend endpoints using standard Bearer token authorization.

---

## 7. Architecture for Team Member 2

This foundation provides a clean separation for **Member 2 (Admin & Intelligence)** to implement:
1. **Officer & Admin APIs**: `routes/admin.py`
2. **AI Document Verification & OCR**: `services/document_ai.py`
3. **Dynamic Eligibility Engine**: `services/eligibility_engine.py`
4. **Merit & Selection Board**: `routes/selection.py`
5. **No-Code Scheme Configurator**: `routes/scheme_config.py`
6. **Audit Trail Logs**: `database/audit_logger.py`

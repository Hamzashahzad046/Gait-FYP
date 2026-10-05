from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, analysis, history, users
from .core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="GaitGuard Biometric Identification API",
)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router,     prefix=f"{settings.API_V1_STR}/auth",    tags=["auth"])
app.include_router(analysis.router, prefix=f"{settings.API_V1_STR}/analyze", tags=["analysis"])
app.include_router(history.router,  prefix=f"{settings.API_V1_STR}/history", tags=["history"])
app.include_router(users.router,    prefix=f"{settings.API_V1_STR}/users",   tags=["users"])

@app.get("/", tags=["health"])
async def read_root():
    return {"message": "GaitGuard API is running", "status": "active", "version": "1.0.0"}
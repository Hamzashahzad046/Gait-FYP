from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserCreate, UserLogin, Token
from ...core.supabase_client import get_supabase

router = APIRouter()

@router.post("/signup", response_model=dict)
async def signup(user: UserCreate):
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name
                }
            }
        })
        return {"message": "Signup successful. Please check your email for verification.", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    try:
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "access_token": response.session.access_token,
            "user": response.user.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials or email not verified")

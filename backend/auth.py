from fastapi import APIRouter, HTTPException
from jose import jwt
from passlib.context import CryptContext
from db import get_db_connection
from models import LoginRequest, AuthResponse
from monitoring.app_monitor import logger


SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

auth_router = APIRouter()

def get_user_credentials(email):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    query = "SELECT * FROM usuarios WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    return user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@auth_router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    user = get_user_credentials(request.email)
    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": request.email}, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token, "userId": int(user['id']), 'email': str(user['email']), 'password': str(user['password'])}
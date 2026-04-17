from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import hash_password
from app.utils.security import verify_password
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # 🔍 Validar si el teléfono ya existe
    existing_user = db.query(User).filter(User.telefono == user.telefono).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El teléfono ya está registrado")

    # 🔐 Hashear contraseña
    hashed_password = hash_password(user.password)

    # 👤 Crear usuario
    new_user = User(
        nombre=user.nombre,
        telefono=user.telefono,
        password_hash=hashed_password,
        nivel=user.nivel,
        rol="player"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Usuario creado correctamente",
        "user_id": new_user.id
    }

@router.post("/login")
def login(user_data: dict, db: Session = Depends(get_db)):

    telefono = user_data.get("telefono")
    password = user_data.get("password")

    if not telefono or not password:
        raise HTTPException(status_code=400, detail="Datos incompletos")

    # 🔍 Buscar usuario
    user = db.query(User).filter(User.telefono == telefono).first()

    if not user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    # 🔐 Validar password
    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    # 🎟️ Crear token
    token = create_access_token({
        "sub": str(user.id),
        "telefono": user.telefono
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
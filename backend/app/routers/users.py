from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.put("/{user_id}/nivel")
def update_user_level(
    user_id: int,
    nivel: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔐 Validar master
    if current_user.rol != "master":
        raise HTTPException(status_code=403, detail="Solo masters pueden modificar el nivel")

    # 🔍 Buscar usuario
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # ✏️ Actualizar nivel
    user.nivel = nivel

    db.commit()

    return {"message": "Nivel actualizado correctamente"}

@router.get("/{user_id}/whatsapp-link")
def get_whatsapp_link(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔍 Buscar usuario
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if not user.telefono:
        raise HTTPException(status_code=400, detail="El usuario no tiene teléfono registrado")

    # 📱 Limpiar teléfono (por si trae espacios o + o -)
    telefono = user.telefono.replace(" ", "").replace("+", "").replace("-", "")

    # 🇲🇽 Generar link
    whatsapp_link = f"https://wa.me/52{telefono}"

    return {
        "whatsapp_link": whatsapp_link
    }

@router.get("")
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔐 Validar master
    if current_user.rol != "master":
        raise HTTPException(status_code=403, detail="Solo masters pueden ver la lista de usuarios")

    users = db.query(User).all()
    return users
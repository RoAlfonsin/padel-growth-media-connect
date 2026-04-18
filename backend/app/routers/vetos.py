from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/vetos", tags=["Vetos"])


@router.post("/vetar/{user_id}")
def vetar_usuario(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔐 Validar master
    if current_user.rol != "master":
        raise HTTPException(status_code=403, detail="Solo masters pueden vetar usuarios")

    # 🔍 Buscar usuario
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if user.rol == "master":
        raise HTTPException(status_code=405, detail="No se puede vetar a un master")

    # 🚫 Aplicar veto
    user.veto = True

    db.commit()

    return {"message": "Usuario vetado correctamente"}

@router.post("/desvetar/{user_id}")
def desvetar_usuario(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔐 Validar master
    if current_user.rol != "master":
        raise HTTPException(status_code=403, detail="Solo masters pueden desvetar usuarios")

    # 🔍 Buscar usuario
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # ✅ Quitar veto
    user.veto = False

    db.commit()

    return {"message": "Usuario desvetado correctamente"}
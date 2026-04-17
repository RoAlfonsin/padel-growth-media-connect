from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reta import Reta
from app.models.club import Club
from app.models.user import User
from app.schemas.reta import RetaCreate, RetaResponse
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/retas", tags=["retas"])

@router.post("", response_model=RetaResponse)
def create_reta(
    data: RetaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 👑 Validar master
    if current_user.rol != "master":
        raise HTTPException(status_code=403, detail="Solo masters pueden crear retas")

    # 🎾 Validar múltiplo de 4
    if data.cupos_max % 4 != 0:
        raise HTTPException(status_code=400, detail="cupos_max debe ser múltiplo de 4")

    # 🏟️ Validar club existe
    club = db.query(Club).filter(Club.id == data.club_id).first()
    if not club:
        raise HTTPException(status_code=400, detail="El club no existe")

    # 🧱 Crear reta
    new_reta = Reta(
        fecha=data.fecha,
        nivel=data.nivel,
        formato=data.formato,
        cupos_max=data.cupos_max,
        master_id=current_user.id,
        club_id=data.club_id,
        ubicacion=club.nombre,
    )

    db.add(new_reta)
    db.commit()
    db.refresh(new_reta)

    return new_reta
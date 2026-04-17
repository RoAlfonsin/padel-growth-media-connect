from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.club import Club
from app.schemas.club import ClubCreate, ClubResponse
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/clubs", tags=["clubs"])

@router.post("", response_model=ClubResponse)
def create_club(
    club_data: ClubCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 👑 Validar rol master
    if current_user.rol != "master":
        raise HTTPException(status_code=403, detail="No autorizado")

    new_club = Club(
        nombre=club_data.nombre,
        direccion=club_data.direccion,
        direccion_url=club_data.direccion_url,
        logo_url=club_data.logo_url,
        pgm_profile_url=club_data.pgm_profile_url
    )

    db.add(new_club)
    db.commit()
    db.refresh(new_club)

    return new_club

@router.get("", response_model=list[ClubResponse])
def get_clubs(db: Session = Depends(get_db)):
    clubs = db.query(Club).all()
    return clubs
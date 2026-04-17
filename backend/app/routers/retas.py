from fastapi import APIRouter, Depends, HTTPException, Path
from datetime import datetime
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reta import Reta
from app.models.club import Club
from app.models.user import User
from app.models.reta_player import RetaPlayer
from app.schemas.reta import RetaCreate, RetaResponse, RetaListResponse, RetaDetailResponse
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

@router.get("", response_model=list[RetaListResponse])
def get_retas(
    tipo: str = "activas",  # activas | historial
    db: Session = Depends(get_db)
):
    now = datetime.utcnow()

    query = db.query(Reta)

    # 🎯 Filtro por tipo
    if tipo == "activas":
        query = query.filter(Reta.fecha >= now)
    elif tipo == "historial":
        query = query.filter(Reta.fecha < now)

    retas = query.order_by(Reta.fecha.asc()).all()

    result = []

    for reta in retas:
        # 👥 jugadores activos
        jugadores_activos = [
            rp for rp in reta.jugadores if rp.status == "activo"
        ]

        cupos_disponibles = reta.cupos_max - len(jugadores_activos)

        result.append({
            "id": reta.id,
            "fecha": reta.fecha,
            "nivel": reta.nivel,
            "formato": reta.formato,
            "cupos_max": reta.cupos_max,
            "ubicacion": reta.ubicacion,
            "club_nombre": reta.club.nombre,
            "club_logo_url": reta.club.logo_url,
            "cupos_disponibles": cupos_disponibles,
            "total_jugadores": len(jugadores_activos),
            "jugadores_activos": [
            {
                "user_id": rp.user.id if rp.user else None,
                "nombre": rp.user.nombre if rp.user else rp.invitado_nombre
            }
            for rp in jugadores_activos
            ],
        })

    return result

@router.get("/{reta_id}", response_model=RetaDetailResponse)
def get_reta_detail(
    reta_id: int = Path(...),
    db: Session = Depends(get_db)
):
    reta = db.query(Reta).filter(Reta.id == reta_id).first()

    if not reta:
        raise HTTPException(status_code=404, detail="Reta no encontrada")

    # 👥 jugadores activos
    jugadores_activos = [
        rp for rp in reta.jugadores if rp.status == "activo"
    ]

    jugadores_response = []

    for rp in jugadores_activos:
        if rp.user:  # 👤 Usuario real
            jugadores_response.append({
                "user_id": rp.user.id,
                "nombre": rp.user.nombre,
                "nivel": rp.user.nivel,
                "confirmado": rp.confirmado,
                "pareja": rp.pareja,
                "status": rp.status
            })
        else:  # 👥 Invitado
            jugadores_response.append({
                "user_id": None,
                "nombre": rp.invitado_nombre,
                "nivel": None,
                "confirmado": rp.confirmado,
                "pareja": False,
                "status": rp.status
            })

    cupos_ocupados = len(jugadores_activos)
    cupos_disponibles = reta.cupos_max - cupos_ocupados

    return {
        "id": reta.id,
        "fecha": reta.fecha,
        "nivel": reta.nivel,
        "formato": reta.formato,
        "cupos_max": reta.cupos_max,
        "ubicacion": reta.ubicacion,
        "club_nombre": reta.club.nombre,
        "club_logo_url": reta.club.logo_url,
        "club_direccion": reta.club.direccion,
        "jugadores": jugadores_response,
        "cupos_ocupados": cupos_ocupados,
        "cupos_disponibles": cupos_disponibles
    }

@router.post("/{reta_id}/join")
def join_reta(
    reta_id: int,
    con_pareja: bool = False,
    nombre_pareja: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔍 Buscar reta
    reta = db.query(Reta).filter(Reta.id == reta_id).first()

    if not reta:
        raise HTTPException(status_code=404, detail="Reta no encontrada")

    # 🔍 Buscar si ya existe registro del usuario
    existing = db.query(RetaPlayer).filter(
        RetaPlayer.reta_id == reta_id,
        RetaPlayer.user_id == current_user.id
    ).first()

    if existing:
        # 👉 Si estaba "salio", lo reactivamos
        if existing.status == "salio":
            existing.status = "activo"
            existing.confirmado = False
            existing.pareja = con_pareja
        else:
            raise HTTPException(status_code=400, detail="Ya estás en la reta")
    else:
        # 🧱 Crear registro principal
        player = RetaPlayer(
            reta_id=reta_id,
            user_id=current_user.id,
            confirmado=False,
            pareja=con_pareja,
            status="activo"
        )
        db.add(player)

    # 👥 Manejo de pareja
    if con_pareja:
        if not nombre_pareja:
            raise HTTPException(status_code=400, detail="Nombre de pareja requerido")

        pareja_player = RetaPlayer(
            reta_id=reta_id,
            user_id=None,  # 👈 invitado
            invitado_nombre=nombre_pareja,
            confirmado=False,
            pareja=False,
            status="activo",
            parent_player_id=current_user.id # 👈 relacionamos con el jugador principal
        )

        db.add(pareja_player)

    db.commit()

    return {"message": "Te uniste a la reta correctamente"}

@router.post("/{reta_id}/leave")
def leave_reta(
    reta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 🔍 Buscar registro del usuario
    player = db.query(RetaPlayer).filter(
        RetaPlayer.reta_id == reta_id,
        RetaPlayer.user_id == current_user.id,
        RetaPlayer.status == "activo"
    ).first()

    if not player:
        raise HTTPException(status_code=400, detail="No estás en esta reta")
    
    if player.confirmado:
        raise HTTPException(status_code=400, detail="No puedes salir de la reta después de confirmar tu asistencia")

    # 🚪 Salir de la reta
    player.status = "salio"
    player.confirmado = False  # reset confirmación al salir

    # salir invitados ligados
    invitados = db.query(RetaPlayer).filter(
    RetaPlayer.parent_player_id == current_user.id,
    RetaPlayer.status == "activo"
    ).all()

    for inv in invitados:
        inv.status = "salio"
        inv.confirmado = False

    db.commit()

    return {"message": "Saliste de la reta correctamente"}
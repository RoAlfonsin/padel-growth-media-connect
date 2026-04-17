from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class RetaCreate(BaseModel):
    fecha: datetime
    nivel: str
    formato: Optional[str] = None
    cupos_max: int
    club_id: int


class RetaResponse(BaseModel):
    id: int
    fecha: datetime
    nivel: str
    formato: Optional[str]
    cupos_max: int
    master_id: int
    club_id: int

    class Config:
        orm_mode = True


class RetaListResponse(BaseModel):
    id: int
    fecha: datetime
    nivel: str
    formato: Optional[str]
    cupos_max: int
    ubicacion: Optional[str]
    club_logo_url: Optional[str]
    club_nombre: str
    cupos_disponibles: int
    total_jugadores: int
    jugadores_activos: list

    class Config:
        orm_mode = True


class PlayerInReta(BaseModel):
    user_id: int
    nombre: str
    nivel: str | None
    confirmado: bool
    pareja: bool
    status: str

    class Config:
        orm_mode = True


class RetaDetailResponse(BaseModel):
    id: int
    fecha: datetime
    nivel: str
    formato: Optional[str]
    cupos_max: int
    ubicacion: Optional[str]
    club_nombre: str
    club_logo_url: Optional[str]
    club_direccion: str
    jugadores: List[PlayerInReta]
    cupos_ocupados: int
    cupos_disponibles: int

    class Config:
        orm_mode = True
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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
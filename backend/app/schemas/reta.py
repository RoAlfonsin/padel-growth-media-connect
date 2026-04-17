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
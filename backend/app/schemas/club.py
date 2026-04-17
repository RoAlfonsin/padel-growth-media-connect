from pydantic import BaseModel
from typing import Optional

class ClubCreate(BaseModel):
    nombre: str
    direccion: str
    direccion_url: Optional[str] = None
    logo_url: Optional[str] = None
    pgm_profile_url: Optional[str] = None


class ClubResponse(BaseModel):
    id: int
    nombre: str
    direccion: str
    direccion_url: Optional[str]
    logo_url: Optional[str]
    pgm_profile_url: Optional[str]

    class Config:
        orm_mode = True
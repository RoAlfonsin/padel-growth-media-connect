from pydantic import BaseModel

class UserCreate(BaseModel):
    nombre: str
    telefono: str
    password: str
    nivel: str | None = None
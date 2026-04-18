from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    telefono = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    nivel = Column(String, nullable=True)
    rol = Column(String, default="player")  # "master" o "player"
    veto = Column(Boolean, default=False)  # Campo para indicar si el usuario está vetado
    created_at = Column(DateTime(timezone=True), server_default=func.now())
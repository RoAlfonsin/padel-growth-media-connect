from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Reta(Base):
    __tablename__ = "retas"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(DateTime, nullable=False)
    nivel = Column(String, nullable=False)
    formato = Column(String, nullable=True)
    cupos_max = Column(Integer, nullable=False)
    ubicacion = Column(String, nullable=True)

    master_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 🔗 Relaciones
    master = relationship("User")
    club = relationship("Club", back_populates="retas")
    jugadores = relationship("RetaPlayer", back_populates="reta")
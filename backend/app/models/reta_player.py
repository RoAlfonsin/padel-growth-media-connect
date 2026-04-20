from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class RetaPlayer(Base):
    __tablename__ = "reta_players"

    id = Column(Integer, primary_key=True, index=True)

    reta_id = Column(Integer, ForeignKey("retas.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    invitado_nombre = Column(String, nullable=True)  # Solo para invitados
    pareja = Column(Boolean, default=False)
    confirmado = Column(Boolean, default=False)
    status = Column(String, default="activo")  # activo | salio
    parent_player_id = Column(Integer, nullable=True) # Para jugadores en pareja

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 🔗 Relaciones
    reta = relationship("Reta", back_populates="jugadores")
    user = relationship("User")
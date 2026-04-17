from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    direccion_url = Column(String, nullable=True)  # 👈 nuevo campo
    logo_url = Column(String, nullable=True)
    pgm_profile_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    #retas = relationship("Reta", back_populates="club")
from fastapi import FastAPI
from app.database import engine, Base
from app.models import user  # IMPORTANTE

app = FastAPI()

# Crear tablas automáticamente
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "API running"}
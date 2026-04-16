from fastapi import FastAPI
from app.database import engine, Base
from app.models import user  # IMPORTANTE

app = FastAPI()

@app.on_event("startup")
def on_startup():
    # Crear tablas al arrancar la app, no al importar el módulo.
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "API running"}

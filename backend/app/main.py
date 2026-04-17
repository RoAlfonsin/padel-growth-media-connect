from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, club, reta, reta_player  # IMPORTANTE
from app.routers import auth, clubs, retas

app = FastAPI()
app.include_router(auth.router)
app.include_router(clubs.router)
app.include_router(retas.router)



@app.on_event("startup")
def on_startup():
    # Crear tablas al arrancar la app, no al importar el módulo.
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "API running"}

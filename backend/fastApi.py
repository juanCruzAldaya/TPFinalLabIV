from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import get_db_connection
from auth import auth_router
from users import users_router
from userCalendar import calendar_router
from services import services_router
from categories import categories_router
from contracts import contracts_router
from reviews import reviews_router
from events import events_router

origins = [
    "http://localhost:4200",
    "http://localhost:8080",
]


# Incluir los enrutadores en la aplicación principal
def includer ():

    
    app = FastAPI()

    # Configuración de CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos permitidos
        allow_headers=["*"],
    )

    app.include_router(auth_router)
    app.include_router(users_router)
    app.include_router(calendar_router)
    app.include_router(services_router)
    app.include_router(categories_router)
    app.include_router(reviews_router)
    app.include_router(contracts_router)
    app.include_router(events_router)

    return app


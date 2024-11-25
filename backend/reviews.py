from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models import Resena

reviews_router = APIRouter()

@reviews_router.get("/resenas")
def get_resenas():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM resenas")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@reviews_router.post("/resenas")
def add_resena(resena: Resena):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO resenas (id, servicio_id, cliente_id, calificacion, comentario, fecha) 
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (0, resena.servicio_id, resena.cliente_id, resena.calificacion, resena.comentario, resena.fecha))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Resena added successfully"}
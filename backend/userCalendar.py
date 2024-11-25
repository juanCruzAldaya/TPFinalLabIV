from fastapi import APIRouter, HTTPException
from datetime import datetime,time, timedelta
from typing import List
from db import get_db_connection
from models import CalendarioBase, CalendarioResponse, CalendarioCreate, EventoBase



def convert_timedelta_to_time(td: timedelta) -> time:
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return time(hours, minutes, seconds)




def get_calendario_by_usuario(usuario_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    query = "SELECT * FROM calendarios WHERE usuario_id = %s"
    cursor.execute(query, (usuario_id,))
    calendario = cursor.fetchone()
    
    if not calendario:
        return None
    
    query_eventos = "SELECT * FROM eventos WHERE calendario_id = %s"
    cursor.execute(query_eventos, (calendario['id'],))
    eventos = cursor.fetchall()
    cursor.close()

    eventos_list = [
        EventoBase(
            calendario_id=evento['calendario_id'],
            fecha=evento['fecha'],
            hora_inicio=convert_timedelta_to_time(evento['hora_inicio']),
            hora_fin=convert_timedelta_to_time(evento['hora_fin']),
            estado=evento['estado']
        ) 
        for evento in eventos
    ]
    
    calendario_data = CalendarioBase(
        usuario_id=calendario['usuario_id'],
        anio=calendario['anio'],
        mes=calendario['mes'],
        eventos=eventos_list
    )
    
    return calendario_data




# Crear un enrutador para las rutas relacionadas con calendarios
calendar_router = APIRouter()

# Obtener el calendario por el ID del usuario
@calendar_router.get("/calendarByUsername/{user_id}")
def get_calendarByUserId(user_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id FROM calendarios WHERE usuario_id = %s", (user_id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    
    if result is None:
        raise HTTPException(status_code=404, detail="Calendar not found")
    
    return {"calendar_id": result["id"]}

# Obtener los slots disponibles para un usuario en una fecha específica
@calendar_router.get("/availableSlots/{user_id}/{date}", response_model=List[str])
def get_available_slots(user_id: int, date: str):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM eventos WHERE calendario_id = (SELECT id FROM calendarios WHERE usuario_id = %s) AND fecha = %s", (user_id, date))
    events = cursor.fetchall()
    
    all_slots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
    
    unavailable_slots = []
    for event in events:
        hora_inicio = event['hora_inicio']
        if isinstance(hora_inicio, datetime):
            hora_inicio = hora_inicio.time()
        elif isinstance(hora_inicio, timedelta):
            hora_inicio = (datetime.min + hora_inicio).time()
        unavailable_slots.append(hora_inicio.strftime("%H:%M"))
    
    available_slots = [slot for slot in all_slots if slot not in unavailable_slots]
    
    cursor.close()
    db.close()
    
    return available_slots

# Obtener todos los slots disponibles
@calendar_router.get("/available_slots")
def get_available_slots():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM eventos")
    events = cursor.fetchall()
    cursor.close()

    unavailable_slots = []
    for event in events:
        if event['estado'] != 'disponible':
            hora_inicio = event['hora_inicio']
            if isinstance(hora_inicio, datetime):
                hora_inicio = hora_inicio.time()
            elif isinstance(hora_inicio, timedelta):
                hora_inicio = (datetime.min + hora_inicio).time()
            unavailable_slots.append(hora_inicio.strftime("%H:%M"))

    return unavailable_slots

# Obtener todos los calendarios
@calendar_router.get("/calendario")
def get_calendario():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM calendario")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

# Crear un nuevo calendario
@calendar_router.post("/calendarios", response_model=CalendarioResponse)
async def create_calendario(calendario: CalendarioBase):
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO calendarios (usuario_id, mes, anio) 
            VALUES (%s, %s, %s)
        """, (calendario.usuario_id, calendario.anio, calendario.mes))
        db.commit()
        calendario_id = cursor.lastrowid
        cursor.close()
        db.close()
        return {
            "usuario_id": calendario.usuario_id,
            "anio": calendario.anio,
            "mes": calendario.mes,
            "id": calendario_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Crear un nuevo calendario (método adicional)
# @calendar_router.post("/calendarios/", response_model=CalendarioResponse)
# def create_calendario(calendario: CalendarioCreate):
#     db = get_db_connection()
#     if db:
#         return create_calendario(db, calendario)
#     else:
#         raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

# Leer un calendario por el ID del usuario
@calendar_router.get("/calendarios/{usuario_id}", response_model=CalendarioBase)
def read_calendario(usuario_id: int):
    calendario = get_calendario_by_usuario(usuario_id)
    if not calendario:
        raise HTTPException(status_code=404, detail="Calendario no encontrado")
    return calendario



from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models import EventoBase, EventoResponse, EventoUpdate, DeleteResponse, EventIdResponser, EventoIDUpdate
from monitoring.app_monitor import logger

# Crear un enrutador para las rutas relacionadas con eventos
events_router = APIRouter()

# Crear un nuevo evento
@events_router.post("/eventos")
def create_evento(evento: EventoBase):
    logger.info("Creating a new event")
    db = get_db_connection()
    cursor = db.cursor()
    query = """
    INSERT INTO eventos (id, calendario_id, fecha, hora_inicio, hora_fin, estado)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (0, evento.calendario_id, evento.fecha, evento.hora_inicio, evento.hora_fin, evento.estado))
    db.commit()
    evento_id = cursor.lastrowid
    cursor.close()
    logger.info(f"Event created with ID: {evento_id}")
    return {**evento.dict(), "id": evento_id}

# Actualizar un evento existente
@events_router.put("/eventos/{evento_id}", response_model=EventoResponse)
def update_evento(evento_id: int, evento: EventoUpdate):
    logger.info(f"Updating event with ID: {evento_id}")
    db = get_db_connection()
    if db:
        result = update_evento(db, evento_id, evento)
        logger.info(f"Event with ID: {evento_id} updated successfully")
        return result
    else:
        logger.error("Error connecting to the database")
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

# Obtener el ID de un evento por el ID de la contratación
@events_router.get("/event_id/{id}")
def get_event_id(id: int):
    logger.info(f"Fetching event ID for contract ID: {id}")
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT evento_id FROM contrataciones WHERE id = %s", (id,))
    results = cursor.fetchall()
    cursor.close()
    db.close()
    if results:
        result = results[0]  # Acceder al primer elemento de la lista
        logger.info(f"Event ID found: {result['evento_id']}")
        return EventIdResponser(evento_id=int(result['evento_id']))
    else:
        logger.warning(f"No event found for contract ID: {id}")
        return {"error": "Event not found"}, 404

# Eliminar un evento
@events_router.delete("/delete_event/{evento_id}", response_model=DeleteResponse)
def delete_evento(evento_id: int):
    logger.info(f"Deleting event with ID: {evento_id}")
    db = get_db_connection()
    if db:
        cursor = db.cursor()
        query = """
        DELETE FROM eventos WHERE id = %s;
        """
        cursor.execute(query, (evento_id,))
        db.commit()
        cursor.close()
        db.close()
        logger.info(f"Event with ID: {evento_id} deleted successfully")
        return DeleteResponse(message="Event deleted successfully")
    else:
        logger.error("Error connecting to the database")
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")
    
    # Actualizar el ID del evento en una contratación
@events_router.put("/update_contract_event_id/{contrato_id}")
def update_contract_event_id(contrato_id: int, evento_update: EventoIDUpdate):
    logger.info(f"Updating event ID for contract ID: {contrato_id}")
    db = get_db_connection()
    cursor = db.cursor()
    query = """
    UPDATE contrataciones
    SET evento_id = %s
    WHERE id = %s
    """
    cursor.execute(query, (evento_update.evento_id, contrato_id))
    db.commit()
    cursor.close()
    logger.info(f"Event ID for contract ID: {contrato_id} updated successfully")
    return {"message": "Evento ID actualizado"}
from fastapi import APIRouter, HTTPException
from db import get_db_connection, err
from models import Contratacion, StatusUpdate, EventoIDUpdate


contracts_router = APIRouter()

@contracts_router.get("/contrataciones")
def get_contrataciones():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contrataciones")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results




# Obtener el servicio_id de una contratación específica

@contracts_router.get("/contrataciones_service_id/{id}")
def get_contrataciones_servicio_id(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT servicio_id FROM contrataciones where id = %s", (id,))
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return {"servicio_id": results[0]['servicio_id']} if results else {}




@contracts_router.put("/update_contract_event_id/{contrato_id}")
def update_contract_event_id(contrato_id: int, evento_update: EventoIDUpdate):
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
    return {"message": "Evento ID actualizado"}




# Agregar una nueva contratación
@contracts_router.post("/contrataciones")
def add_contratacion(contratacion: Contratacion):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO contrataciones (cliente_id, servicio_id, fecha_contratacion, calendario_id, estado, domicilio, contacto, comentarios, hora_contratacion, evento_id) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            contratacion.cliente_id, 
            contratacion.servicio_id, 
            contratacion.fecha_contratacion, 
            contratacion.calendario_id, 
            contratacion.estado, 
            contratacion.domicilio, 
            contratacion.contacto, 
            contratacion.comentarios,
            contratacion.hora_contratacion,
            contratacion.evento_id
        ))
        db.commit()
        return {"message": "Contratacion added successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        db.close()



# Obtener las contrataciones de un cliente específico

@contracts_router.get("/contrataciones_clientes/{id_usuario}")
def get_contrataciones_clientes(id_usuario: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.callproc('contrataciones_clientes', [id_usuario])
        for result in cursor.stored_results():
            data = result.fetchall()
        cursor.close()
        db.close()
        return data
    except err as error:
        cursor.close()
        db.close()
        raise HTTPException(status_code=500, detail=str(error))



# Obtener las contrataciones de un profesional específico
@contracts_router.get("/contrataciones_profesionales/{id_usuario}")
def get_contrataciones_profesionales(id_usuario: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.callproc('contrataciones_profesionales', [id_usuario])
        for result in cursor.stored_results():
            data = result.fetchall()
        cursor.close()
        db.close()
        return data
    except err as error:
        cursor.close()
        db.close()
        raise HTTPException(status_code=500, detail=str(error))





# Actualizar el estado de una contratación
@contracts_router.put("/contracts_status/{contract_id}")
def update_contract_status(contract_id: int, status_update: StatusUpdate):
    db = get_db_connection()
    cursor = db.cursor()
    try:
        update_query = """
        UPDATE contrataciones
        SET estado = %s
        WHERE id = %s
        """
        cursor.execute(update_query, (status_update.estado, contract_id))
        db.commit()
        return {"message": "Contract status updated successfully"}
    except err as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(error))
    finally:
        cursor.close()
        db.close()
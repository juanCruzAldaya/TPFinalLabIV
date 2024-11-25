from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models import Servicio

services_router = APIRouter()

@services_router.get("/mis-servicios/{profesionalId}")
def get_mis_servicios(profesionalId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios WHERE profesionalId = %s", (profesionalId,))
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@services_router.get("/servicio/{servicioId}")
def get_servicio(servicioId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios WHERE id = %s", (servicioId,))
    results = cursor.fetchone()
    cursor.close()
    db.close()
    return results

@services_router.get("/servicio/{servicioId}/{profesionalId}")
def get_servicio_by_profesiona_id(servicioId: int, profesionalId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios WHERE id = %s AND profesionalId = %s", (servicioId, profesionalId))
    results = cursor.fetchone()
    cursor.close()
    db.close()
    return results

@services_router.delete("/eliminar-servicio/{servicioId}")
def delete_servicio(servicioId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("DELETE FROM servicios WHERE id = %s", (servicioId,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Servicio deleted successfully"}

@services_router.get("/servicios")
def get_servicios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@services_router.post("/servicios")
def add_servicio(servicio: Servicio):
    db = get_db_connection()
    cursor = db.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO servicios (profesionalId, description, mainCategory, secondaryCategory, state, department, locality) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            servicio.profesionalId,
            servicio.description,
            servicio.mainCategory,
            servicio.secondaryCategory,
            servicio.state,
            servicio.department,
            servicio.locality, 
        ))

        new_id = cursor.lastrowid
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar el servicio: {str(e)}")
    finally:
        cursor.close()
        db.close()
    
    return {"message": "Servicio agregado exitosamente", "servicio_id": new_id}

@services_router.put("/editar-servicio")
def update_service(servicio: Servicio):
    db = get_db_connection()
    cursor = db.cursor()
										
    try:
        update_query = """
        UPDATE servicios
        SET 
            description = %s,
            mainCategory = %s,
            secondaryCategory = %s,
            state = %s,
            department = %s,
            locality = %s
        WHERE id = %s AND profesionalId = %s
        """
        cursor.execute(
            update_query, 
            (
                servicio.description,  # Corrected the order
                servicio.mainCategory, 
                servicio.secondaryCategory, 
									  
                servicio.state, 
                servicio.department, 
                servicio.locality, 
                servicio.id, 
                servicio.profesionalId
            )
        )
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Service not found or no updates were applied.")

    except Exception as e:
        db.rollback()
										  
        print(f"Error updating service: {e}")  # Replace with proper logging
        raise HTTPException(status_code=500, detail=f"Error updating service: {e}")

    finally:
        cursor.close()
        db.close()
    
    return {"message": "Service updated successfully"}



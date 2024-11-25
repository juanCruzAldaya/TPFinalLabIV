from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models import Usuario
from auth import pwd_context

def update_user(user_id: int, usuario: Usuario):
    db = get_db_connection()
    cursor = db.cursor()
    
    # Fetch existing email and password
    select_query = """
    SELECT email, password FROM usuarios 
    WHERE id = %s
    """
    cursor.execute(select_query, (user_id,))
    result = cursor.fetchone()
    if result:
        email, password = result
        usuario.email = email
        usuario.password = password
    # Update user information
    update_query = """
    UPDATE usuarios
    SET nombre = %s, apellido = %s, contacto = %s, nacimiento = %s, ciudad = %s, calificacion_promedio = %s
    WHERE id = %s
    """
    cursor.execute(update_query, (usuario.nombre, usuario.apellido, usuario.contacto, usuario.nacimiento, usuario.ciudad, usuario.calificacion_promedio, user_id))
    
    db.commit()
    cursor.close()

# Crear un enrutador para las rutas relacionadas con usuarios
users_router = APIRouter()

# Obtener un profesional por su ID
@users_router.get("/usuarios/{id}")
def get_profesional(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT nombre, apellido FROM usuarios WHERE id = %s", (id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result is None:
        raise HTTPException(status_code=404, detail="Profesional no encontrado")
    return result

# Obtener el ID del profesional asociado a un servicio específico
@users_router.get("/get_profesional_id_by_service/{id}")
def get_profesional(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT profesionalId FROM servicios WHERE id = %s", (id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result is None:
        raise HTTPException(status_code=404, detail="Profesional no encontrado")
    return result

# Actualizar un usuario existente
@users_router.put("/usuarios/{user_id}")
def update_usuario(user_id: int, usuario: Usuario):
    db = get_db_connection()
    if db:
        try:
            update_user(user_id, usuario)
            return {"message": "Usuario actualizado correctamente"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            db.close()
    else:
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

# Obtener todos los usuarios
@users_router.get("/usuarios")
def get_usuarios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

# Agregar un nuevo usuario
@users_router.post("/usuarios")
def add_usuario(usuario: Usuario):
    db = get_db_connection()
    if db:
        cursor = db.cursor()
        hashed_password = pwd_context.hash(usuario.password)
        cursor.execute("INSERT INTO usuarios (email, password) VALUES (%s, %s)", (usuario.email, hashed_password))
        db.commit()
        cursor.close()
        db.close()
        return {"message": "Usuario added successfully"}
    

@users_router.get("/usuariosC/{id}")
def get_profesional(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result is None:
        raise HTTPException(status_code=404, detail="Profesional no encontrado")
    return result




@users_router.get("/ultimo_id")
def get_last_user_id():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT id FROM usuarios ORDER BY id DESC LIMIT 1")
        result = cursor.fetchall()
        if result:
            return {"id": result[0]}
        else:
            raise HTTPException(status_code=404, detail="No users found")
    finally:
        cursor.close()
        connection.close()

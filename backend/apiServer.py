from fastapi import FastAPI, HTTPException
from .models import *
from datetime import date, time, timedelta, datetime

from fastapi.responses import JSONResponse
import mysql.connector
from jose import  jwt
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext


SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
origins = [
    "http://localhost:4200",
    "http://localhost:8080",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




def get_db_connection():
    db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="laburappdb")
    
    return db




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



def get_user_credentials(email):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    
    query = "SELECT * FROM usuarios WHERE email = %s"
    result = cursor.execute(query, (email,))  # Asegúrate de que 'email' está en una tupla
    user = cursor.fetchone()
    cursor.close()
    db.close()
    
    return user



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)






@app.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    
    user = get_user_credentials(request.email)
        
    if not user or not verify_password(request.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    



    token = jwt.encode({"sub": request.email}, SECRET_KEY, algorithm=ALGORITHM)



    return {"token": token, "userId": int(user['id']), 'email': str(user['email']), 'password': str(user['password'])}


@app.get("/usuarios/{id}")
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


@app.put("/usuarios/{user_id}")
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
    
@app.get("/usuariosC/{id}")
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




@app.get("/ultimo_id")
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

@app.get("/usuarios")
def get_usuarios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/usuarios")
def add_usuario(usuario: Usuario):
    
    db = get_db_connection()
    if db:
        db.get_server_info()
        cursor = db.cursor()
        hashed_password = pwd_context.hash(usuario.password)

        cursor.execute("""
            INSERT INTO usuarios (email, password) 
            VALUES (%s, %s)
        """, (usuario.email, hashed_password))
        db.commit()

        cursor.close()
        db.close()  
        return {"message": "Usuario added successfully"}




@app.get("/calendarByUsername/{user_id}")
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



@app.get("/availableSlots/{user_id}/{date}", response_model=List[str])
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
            # Convert timedelta to time
            hora_inicio = (datetime.min + hora_inicio).time()
        unavailable_slots.append(hora_inicio.strftime("%H:%M"))
    
    available_slots = [slot for slot in all_slots if slot not in unavailable_slots]
    
    cursor.close()
    db.close()
    
    return available_slots

@app.get("/available_slots")
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
                # Convert timedelta to time
                hora_inicio = (datetime.min + hora_inicio).time()
            unavailable_slots.append(hora_inicio.strftime("%H:%M"))

    return unavailable_slots


@app.get("/categorias")
def get_categorias():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categorias")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results


@app.get("/categoria/{categoria_id}")
def get_categoria(categoria_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM categorias WHERE id = %s", (categoria_id,))
        
        # Fetch all results to ensure there are no unread results
        results = cursor.fetchone()
        
        if not results:
            raise HTTPException(status_code=404, detail="Subcategories not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()



@app.post("/categorias")
def add_categoria(categoria: Categoria):
    db = get_db_connection()
    cursor = db.cursor()    
    cursor.execute("INSERT INTO categwaorias (nombre) VALUES (%s)", (categoria.nombre,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Categoria added successfully"}






@app.get("/subcategorias/{categoria_id}")
def get_subcategoria(categoria_id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM subcategorias WHERE categoria_id = %s", (categoria_id,))
        
        # Fetch all results to ensure there are no unread results
        results = cursor.fetchone()
        
        if not results:
            raise HTTPException(status_code=404, detail="Subcategories not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()

@app.get("/subcategoria/{id}")
def get_subcategoria(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT * FROM subcategorias WHERE id = %s", (id,))
        
        # Fetch all results to ensure there are no unread results
        results = cursor.fetchall()
        
        if not results:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()



        

@app.get("/subcategoriasById/{id}")
def get_subcategoria(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM subcategorias WHERE categoria_id = %s", (id,))
        
        # Fetch all results to ensure there are no unread results
        results = cursor.fetchall()

        if not results:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        
        return results
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        cursor.close()
        connection.close()




@app.get("/subcategorias")
def get_subcategorias():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM subcategorias")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results


@app.post("/subcategorias")
def add_subcategoria(subcategoria: SubCategoria):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO subcategorias (nombre, categoria_id) VALUES (%s, %s)", (subcategoria.nombre, subcategoria.categoria_id))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "SubCategoria added successfully"}

@app.get("/mis-servicios/{profesionalId}")
def get_mis_servicios(profesionalId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios WHERE profesionalId = %s", (profesionalId,))
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.get("/servicio/{servicioId}")
def get_servicio(servicioId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    print("servicioId: %s",servicioId)
    cursor.execute("SELECT * FROM servicios WHERE id = %s", (servicioId))
    results = cursor.fetchone()
    cursor.close()
    db.close()
    return results

@app.get("/servicio/{servicioId}/{profesionalId}")
def get_servicio_by_profesiona_id(servicioId: int, profesionalId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    print("servicioId: %s",profesionalId)
    print("servicioId: %s",servicioId)
    cursor.execute("SELECT * FROM servicios WHERE id = %s AND profesionalId = %s", (servicioId, profesionalId))
    results = cursor.fetchone()
    cursor.close()
    db.close()
    return results
    
@app.delete("/eliminar-servicio/{servicioId}")
def delete_servicio(servicioId: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    print("servicioId: %s",servicioId)
    cursor.execute("DELETE FROM servicios WHERE id = %s", (servicioId,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Servicio deleted successfully"}

    
                                     
@app.get("/servicios")
def get_servicios():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/servicios")
def add_servicio(servicio: Servicio):
    db = get_db_connection()
    cursor = db.cursor()
    
    print('Servicio recibido:', servicio)

    try:
        # Insertar en la tabla servicios
        cursor.execute("""
            INSERT INTO servicios (profesionalId, description, mainCategory, secondaryCategory, state, department, locality) 
            VALUES ( %s, %s, %s, %s, %s, %s, %s)
        """, (
            servicio.profesionalId,
            servicio.description,
            servicio.mainCategory,
            servicio.secondaryCategory,
            servicio.state,
            servicio.department,
            servicio.locality, 
        ))

        # Obtener el ID del nuevo servicio insertado
        new_id = cursor.lastrowid
        print("Committing transaction...")
        db.commit()
        print("Transaction committed successfully.")

    except Exception as e:
        db.rollback()  # Deshacer si hay algún error
        raise HTTPException(status_code=500, detail=f"Error al agregar el servicio: {str(e)}")
    finally:
        cursor.close()
        db.close()
    
    return {"message": "Servicio agregado exitosamente", "servicio_id": new_id}





@app.put("/editar-servicio")
def update_service(servicio: Servicio):
    db = get_db_connection()
    cursor = db.cursor()
    print('servicio.id, %s',servicio.id)
    try:
        update_query = """
        UPDATE servicios
        SET 
            description = %s,
            mainCategory = %s,
            secondaryCategory = %s,
            state = %s,
            department = %s,
            locality = %s,
        WHERE id = %s AND profesionalId = %s
        """
        cursor.execute(
            update_query, 
            (
                servicio.mainCategory, 
                servicio.secondaryCategory, 
                servicio.description, 
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
        # Log the full error for debugging
        print(f"Error updating service: {e}")  # Replace with proper logging
        raise HTTPException(status_code=500, detail=f"Error updating service: {e}")

    finally:
        cursor.close()
        db.close()
    
    return {"message": "Service updated successfully"}





@app.get("/resenas")
def get_resenas():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM resenas")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/resenas")
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


@app.get("/contrataciones")
def get_contrataciones():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contrataciones")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results


@app.get("/contrataciones_service_id/{id}")
def get_contrataciones_servicio_id(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    print(type(id))
    cursor.execute("SELECT servicio_id FROM contrataciones where id = %s" ,(id,))

    results = cursor.fetchall()
    cursor.close()
    db.close()
    return {"servicio_id": results[0]['servicio_id']} if results else {}





@app.post("/contrataciones")
def add_contratacion(contratacion: Contratacion):
    try:    
        db = get_db_connection()
        cursor = db.cursor()
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
        return {"error": str(e)}
    finally:
        cursor.close()
        db.close()

@app.get("/contrataciones_clientes/{id_usuario}")
def get_contrataciones(id_usuario: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.callproc('contrataciones_clientes', [id_usuario])
        for result in cursor.stored_results():
            data = result.fetchall()
        cursor.close()
        db.close()
        return data
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        cursor.close()
        db.close()
        return {"error": str(err)}




@app.get("/contrataciones_profesionales/{id_usuario}")
def get_contrataciones(id_usuario: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.callproc('contrataciones_profesionales', [id_usuario])
        for result in cursor.stored_results():
            data = result.fetchall()
        cursor.close()
        db.close()
        return data
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        cursor.close()
        db.close()
        return {"error": str(err)}




@app.put("/contracts_status/{contract_id}")
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
        cursor.close()
        db.close()
        return {"message": "Contract status updated successfully"}
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        cursor.close()
        db.close()
        raise HTTPException(status_code=500, detail=str(err))




@app.get("/usuarios/{id}")
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





@app.get("/get_profesional_id_by_service/{id}")
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







@app.get("/metodos_de_pago")
def get_metodos_de_pago():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM metodos_de_pago")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/metodos_de_pago")
def add_metodo_de_pago(metodo_de_pago: MetodoDePago):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO metodos_de_pago (cliente_id, tipo, detalles) 
        VALUES (%s, %s, %s)
    """, (metodo_de_pago.cliente_id, metodo_de_pago.tipo, metodo_de_pago.detalles))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Metodo de Pago added successfully"}

@app.get("/direcciones")
def get_direcciones():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM direcciones")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.get("/direcciones/{direccion_id}")
def get_direccion(direccion_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM direcciones WHERE id = %s", (direccion_id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result:
        return result
    raise HTTPException(status_code=404, detail="Direccion not found")

@app.post("/direcciones")
def add_direccion(direccion: Direccion):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO direcciones (cliente_id, direccion, ciudad, codigo_postal)
        VALUES (%s, %s, %s, %s)
    """, (direccion.cliente_id, direccion.direccion, direccion.ciudad, direccion.codigo_postal))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Direccion added successfully"}

@app.put("/direcciones/{direccion_id}")
def update_direccion(direccion_id: int, direccion: Direccion):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE direcciones 
        SET cliente_id = %s, direccion = %s, ciudad = %s, codigo_postal = %s
        WHERE id = %s
    """, (direccion.cliente_id, direccion.direccion, direccion.ciudad, direccion.codigo_postal, direccion_id))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Direccion updated successfully"}

@app.delete("/direcciones/{direccion_id}")
def delete_direccion(direccion_id: int):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM direcciones WHERE id = %s", (direccion_id,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Direccion deleted successfully"}




@app.get("/calendario")
def get_calendario():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM calendario")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/calendarios", response_model=CalendarioResponse)
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





def create_evento(evento: EventoCreate):
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
    return {**evento.model_dump(), "id": evento_id}









@app.put("/update_contracts/{contrato_id}")
def update_contrato(contrato_id: int, contrato: Contratacion):
    db = get_db_connection()
    cursor = db.cursor()
    query = """
    UPDATE contratos
    SET cliente_id = %s, servicio_id = %s, fecha_contratacion = %s, calendario_id = %s,
        estado = %s, domicilio = %s, contacto = %s, estado = %s, comentarios = %s, hora_contratacion = %s
    WHERE id = %s
    """
    cursor.execute(query, (contrato.cliente_id, contrato.cliente_id, contrato.servicio_id, contrato.fecha_contratacion,
                           contrato.calendario_id,contrato.estado, contrato.domicilio, contrato.contacto, contrato.comentarios, contrato.hora_contratacion, contrato.evento_id, contrato_id))
    db.commit()
    cursor.close()
    return {"message": "Contrato actualizado"}



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


# @app.post("/calendarios/", response_model= CalendarioResponse)
# def create_calendario(calendario: CalendarioCreate):
#     db = get_db_connection()
#     if db:
#         return create_calendario(db, calendario)
#     else:

#         raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

@app.get("/calendarios/{usuario_id}", response_model=CalendarioBase)
def read_calendario(usuario_id: int):
    calendario = get_calendario_by_usuario(usuario_id)
    if not calendario:
        raise HTTPException(status_code=404, detail="Calendario no encontrado")
    return calendario

@app.put("/update_contract_event_id/{contrato_id}")
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

@app.post("/eventos")
def create_evento(evento: EventoBase):
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
    return {**evento.dict(), "id": evento_id}



@app.put("/eventos/{evento_id}", response_model=EventoResponse)
def update_evento(evento_id: int, evento: EventoUpdate):
    db = get_db_connection()
    if db:
        return update_evento(db, evento_id, evento)
    else:
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")



@app.get("/event_id/{id}")
def get_event_id(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT evento_id FROM contrataciones WHERE id = %s", (id,))
    results = cursor.fetchall()
    cursor.close()
    db.close()
    if results:
        result = results[0] # Access the first element of the list
        return EventIdResponser(evento_id= int(result['evento_id']))
    else:
        return {"error": "Event not found"}, 404


@app.delete("/delete_event/{evento_id}", response_model=DeleteResponse)
def delete_evento(evento_id: int):
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
        return DeleteResponse(message="Event deleted successfully")
    else:
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)




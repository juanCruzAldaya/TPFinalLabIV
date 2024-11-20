from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal
from datetime import date, time, timedelta, datetime
from typing import Optional, List
from fastapi.responses import JSONResponse
import mysql.connector
from jose import  jwt
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext


SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


app = FastAPI()


def get_db_connection():
    db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
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







class Usuario(BaseModel):
    id: Optional[int]
    email: EmailStr
    password: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    contacto: Optional[str] = None
    ciudad: Optional[str] = None
    nacimiento: Optional[date] = None
    calificacion_promedio: Optional[Decimal] = None


class Categoria(BaseModel):
    id: Optional[int]
    nombre: str

class SubCategoria(BaseModel):
    nombre: str
    categoria_id: int

class Servicio(BaseModel):
    id: Optional[int]
    profesionalId: Optional[str]
    description: Optional[str]
    mainCategory: int
    secondaryCategory: int
    state: Optional[str]
    department: Optional[str]
    locality: Optional[str]

class Resena(BaseModel):
    id: Optional[int]
    servicio_id: int
    cliente_id: int
    calificacion: int = Field(..., ge=1, le=5)
    comentario: Optional[str]


class EventoBase(BaseModel):
    id: Optional[int] = None
    calendario_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    estado: Optional[str] = "disponible"


class CalendarioBase(BaseModel):
    usuario_id: Optional[int] = None
    anio: Optional[int] = None
    mes: Optional[int] = None
    eventos: Optional[List[EventoBase]] = None

class EventoIDUpdate(BaseModel):
    evento_id: int

class Calendario(BaseModel):
    id: Optional[int]
    profesional_id: Optional[int]
    anio: Optional[int]
    mes: Optional[int]


class Contratacion(BaseModel):
    id: int
    cliente_id: int
    servicio_id: int
    fecha_contratacion: str # Should be a string
    hora_contratacion: str # Should be a string
    calendario_id: int
    evento_id: Optional[int] = None
    contacto: str  # Should be a string
    domicilio: str  # Should be a string
    estado: str  # Should be a string
    comentarios: str



class ContractStatusUpdate(BaseModel):
    id: int
    estado: str





class MetodoDePago(BaseModel):
    id: Optional[int]
    cliente_id: int
    tipo: str
    detalles: str

class Direccion(BaseModel):
    id: Optional[int]
    cliente_id: int
    direccion: str
    ciudad: str
    codigo_postal: str



class EventoCreate(EventoBase):
    pass

class EventoUpdate(BaseModel):
    fecha: Optional[date]
    hora_inicio: Optional[time]
    hora_fin: Optional[time]
    estado: Optional[str]



class DeleteResponse(BaseModel):
    message: str


class EventoResponse(EventoBase):
    id: int

    class Config:
        orm_mode = True



class StatusUpdate(BaseModel):
    estado: str



class CalendarioCreate(CalendarioBase):
    pass

class CalendarioResponse(CalendarioBase):
    id: int
    eventos: List[EventoResponse] = []

    class Config:
        orm_mode = True

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    userId: int
    email: str
    password: str


origins = [
    "http://localhost:4200",
    "http://localhost:8080",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    cursor1 = db.cursor(dictionary=True)
    cursor2 = db.cursor()
    # Obtener el nombre de la categoría principal
    cursor1.execute("SELECT nombre FROM categorias WHERE id = %s", (servicio.mainCategory,))
    nombreCategoria = cursor1.fetchone()
    if nombreCategoria:
        nombreCategoria = nombreCategoria['nombre']  # Extraer solo el nombre
    # Insertar en la tabla servicios
    cursor2.execute(" INSERT INTO servicios (profesional_id, nombre, descripcion, calificacion, sub_categoria, provincia, departamento, localidad) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (
        servicio.profesionalId,
        nombreCategoria,
        servicio.description,
        0,  # Calificación inicial
        servicio.secondaryCategory,
        servicio.state,
        servicio.department,
        servicio.locality
    ))
    cursor1.close()
    cursor2.close()
    db.close()
    return {"message": "Servicio added successfully"}

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
        INSERT INTO resenas (servicio_id, cliente_id, calificacion, comentario) 
        VALUES (%s, %s, %s, %s)
    """, (resena.servicio_id, resena.cliente_id, resena.calificacion, resena.comentario))
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






# def create_calendario(calendario: CalendarioCreate):
#     db = get_db_connection()
#     cursor = db.cursor()
#     cursor.execute("""
#         INSERT INTO calendarios (usuario_id, anio, mes) 
#         VALUES (?, ?, ?)
#     """, (calendario.usuario_id, calendario.anio, calendario.mes))
#     db.commit()
#     calendario_id = cursor.lastrowid
#     cursor.close()
#     return {**calendario.model_dump(), "id": calendario_id, "eventos": []}



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


@app.post("/calendarios/", response_model= CalendarioResponse)
def create_calendario(calendario: CalendarioCreate):
    db = get_db_connection()
    if db:
        return create_calendario(db, calendario)
    else:

        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

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




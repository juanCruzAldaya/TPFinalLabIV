from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal
from datetime import date, time, timedelta, datetime
from typing import Optional, List

import mysql.connector
from jose import  jwt
from fastapi.middleware.cors import CORSMiddleware





SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"



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
    # Replace with your actual database connection code
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="laburappdb"
    )
    
    cursor = db.cursor(dictionary=True)
    query = "SELECT email, password FROM users_incompletos WHERE email = %s"
    cursor.execute(query, (email,))
    
    user = cursor.fetchone()
    print(user)
    cursor.close()
    db.close()
    return user


class Usuario(BaseModel):
    id: Optional[int]
    email: EmailStr
    password: str
    nombre: str
    apellido: str
    contacto: str
    ciudad: str
    calificacion_promedio: Optional[Decimal] = Field(None, max_digits=3, decimal_places=2)

class Categoria(BaseModel):
    id: Optional[int]
    nombre: str

class SubCategoria(BaseModel):
    id: Optional[int]
    nombre: str
    categoria_id: int

class Servicio(BaseModel):
    id: Optional[int]
    profesional_id: Optional[int]
    nombre: str
    descripcion: Optional[str]
    precio: Decimal = Field(..., max_digits=10, decimal_places=2)
    calificacion: int = Field(..., ge=1, le=5)
    sub_categoria: int
    provincia: str
    departamento: str
    localidad: str

class Resena(BaseModel):
    id: Optional[int]
    servicio_id: int
    cliente_id: int
    calificacion: int = Field(..., ge=1, le=5)
    comentario: Optional[str]

class Calendario(BaseModel):
    id: Optional[int]
    profesional_id: int
    fecha: str
    hora_inicio: str
    hora_fin: str
    estado: Optional[str] = 'disponible'

class Contratacion(BaseModel):
    id: Optional[int]
    cliente_id: int
    servicio_id: int
    fecha_contratacion: Optional[str]  
    calendario_id: int
    contacto: str
    domicilio: Optional[str]
    estado: Optional[str] = 'pendiente'

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

class User_Incompleto(BaseModel):
    id: int
    email: str
    password: str

class EventoBase(BaseModel):
    calendario_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    estado: Optional[str] = "disponible"

class EventoCreate(EventoBase):
    pass

class EventoUpdate(BaseModel):
    fecha: Optional[date]
    hora_inicio: Optional[time]
    hora_fin: Optional[time]
    estado: Optional[str]

class EventoResponse(EventoBase):
    id: int

    class Config:
        orm_mode = True




class CalendarioBase(BaseModel):
    usuario_id: int
    anio: int
    mes: int
    eventos: List[EventoBase] = []

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




@app.get("/users_incompletos")
def get_users_incompletos():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users_incompletos")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/users_incompletos")
def add_user_incompleto(user_incompleto: User_Incompleto):
    db = get_db_connection()
    print(user_incompleto)
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO users_incompletos (email, password)
        VALUES (%s, %s)
    """, (user_incompleto.email, user_incompleto.password))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "User Incompleto added successfully"}

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
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO usuarios (email, password, nombre, apellido, contacto, ciudad, calificacion_promedio) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (usuario.email, usuario.password, usuario.nombre, usuario.apellido, usuario.contacto, usuario.ciudad, usuario.calificacion_promedio))
    db.commit()
    cursor.close()
    db.close()  
    return {"message": "Usuario added successfully"}

@app.get("/categorias")
def get_categorias():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categorias")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results









@app.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):

    print(request)
    user_data = get_user_credentials(request.email)
    

    if user_data and request.email == user_data['email'] and request.password == user_data['password']:
        
        token = jwt.encode({"sub": request.email}, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")



@app.post("/categorias")
def add_categoria(categoria: Categoria):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO categwaorias (nombre) VALUES (%s)", (categoria.nombre,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Categoria added successfully"}




@app.get("/subcategorias/{id}")
def get_subcategoria(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT nombre FROM subcategorias WHERE id = %s", (id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result is None:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    return result

@app.get("/categorias/{id}")
def get_categoria(id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT nombre FROM categorias WHERE id = %s", (id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return result

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
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO servicios (profesional_id, nombre, descripcion, precio, calificacion, sub_categoria, provincia, departamento, localidad)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (servicio.profesional_id, servicio.nombre, servicio.descripcion, servicio.precio, servicio.calificacion, servicio.sub_categoria, servicio.provincia, servicio.departamento, servicio.localidad))
    db.commit()
    cursor.close()
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
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO contrataciones (cliente_id, servicio_id, fecha_contratacion, calendario_id,contacto, domicilio, estado) 
        VALUES (%s, %s, %s, %s, %s)
    """, (contratacion.cliente_id, contratacion.servicio_id, contratacion.fecha_contratacion, contratacion.calendario_id, contratacion.domicilio, contratacion.contacto, contratacion.estado))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Contratacion added successfully"}

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

@app.get("/users_incompletos")
def get_users_incompletos():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users_incompletos")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.get("/users_incompletos/{user_id}")
def get_user_incompleto(user_id: int):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users_incompletos WHERE id = %s", (user_id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    if result:
        return result
    raise HTTPException(status_code=404, detail="User Incompleto not found")

@app.post("/users_incompletos")
def add_user_incompleto(user_incompleto: User_Incompleto):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO users_incompletos (email, password) VALUES (%s, %s)", (user_incompleto.email, user_incompleto.password))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "User Incompleto added successfully"}

@app.put("/users_incompletos/{user_id}")
def update_user_incompleto(user_id: int, user_incompleto: User_Incompleto):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        UPDATE users_incompletos 
        SET email = %s, password = %s
        WHERE id = %s
    """, (user_incompleto.email, user_incompleto.password, user_id))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "User Incompleto updated successfully"}

@app.delete("/users_incompletos/{user_id}")
def delete_user_incompleto(user_id: int):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("DELETE FROM users_incompletos WHERE id = %s", (user_id,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "User Incompleto deleted successfully"}





@app.get("/calendario")
def get_calendario():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM calendario")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.post("/calendario")
def add_calendario(calendario: Calendario):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO calendario (profesional_id, fecha, hora_inicio, hora_fin, estado) 
        VALUES (%s, %s, %s, %s, %s)
    """, (calendario.profesional_id, calendario.fecha, calendario.hora_inicio, calendario.hora_fin, calendario.estado))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Calendario added successfully"}






def create_calendario(calendario: CalendarioCreate):
    db = get_db_connection()
    cursor = db.cursor()
    query = "INSERT INTO calendarios (usuario_id, anio, mes) VALUES (%s, %s, %s)"
    cursor.execute(query, (calendario.usuario_id, calendario.anio, calendario.mes))
    db.commit()
    calendario_id = cursor.lastrowid
    cursor.close()
    return {**calendario.model_dump(), "id": calendario_id, "eventos": []}



def create_evento(evento: EventoCreate):
    db = get_db_connection()
    cursor = db.cursor()
    query = """
    INSERT INTO eventos (calendario_id, fecha, hora_inicio, hora_fin, estado)
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (evento.calendario_id, evento.fecha, evento.hora_inicio, evento.hora_fin, evento.estado))
    db.commit()
    evento_id = cursor.lastrowid
    cursor.close()
    return {**evento.model_dump(), "id": evento_id}

def update_evento(evento_id: int, evento: EventoUpdate):
    db = get_db_connection()
    cursor = db.cursor()
    query = """
    UPDATE eventos
    SET fecha = %s, hora_inicio = %s, hora_fin = %s, estado = %s
    WHERE id = %s
    """
    cursor.execute(query, (evento.fecha, evento.hora_inicio, evento.hora_fin, evento.estado, evento_id))
    db.commit()
    cursor.close()
    return {**evento.model_dump(), "id": evento_id}

def delete_evento(evento_id: int):
    db = get_db_connection()
    cursor = db.cursor()
    query = "DELETE FROM eventos WHERE id = %s"
    cursor.execute(query, (evento_id,))
    db.commit()
    cursor.close()
    return {"id": evento_id}







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



@app.post("/eventos/", response_model=EventoResponse)
def create_evento(evento: EventoCreate):
    db = get_db_connection()
    if db:
        return create_evento(db, evento)
    else:
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

@app.put("/eventos/{evento_id}", response_model=EventoResponse)
def update_evento(evento_id: int, evento: EventoUpdate):
    db = get_db_connection()
    if db:
        return update_evento(db, evento_id, evento)
    else:
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")

@app.delete("/eventos/{evento_id}", response_model=EventoResponse)
def delete_evento(evento_id: int):
    db = get_db_connection()
    if db:
        return delete_evento(db, evento_id)
    else:
        raise HTTPException(status_code=500, detail="Error al conectar a la base de datos")



# @app.get("/events", response_model=List[EventoBase])
# def get_events(profesionalId: int, date: datetime.date):
#     db = get_db_connection()

#     events = [
#         {"calendario_id": 1, "fecha": date, "hora_inicio": "09:00:00", "hora_fin": "10:00:00", "estado": "reservado"},
#         {"calendario_id": 1, "fecha": date, "hora_inicio": "11:00:00", "hora_fin": "12:00:00", "estado": "reservado"}
#     ]
#     return events


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)




from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal



import mysql.connector

from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

# Configuración de la conexión a MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tpfinallab4"
)


def get_user_credentials(email, db):
    # (Insert your existing database connection code here)

    cursor = db.cursor(dictionary=True)
    query = "SELECT email, password FROM users_incompletos WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    return user




class Profesional(BaseModel):
    id: Optional[int]
    nombre: str
    zona: str
    ciudad: str
    descripcion: Optional[str]
    calificacion_promedio: Optional[Decimal] = Field(None, max_digits=3, decimal_places=2)

class Cliente(BaseModel):
    id: Optional[int]
    nombre: str
    email: EmailStr

class Servicio(BaseModel):
    id: Optional[int]
    profesional_id: Optional[int]
    nombre: str
    descripcion: Optional[str]
    precio: Decimal = Field(..., max_digits=10, decimal_places=2)

class Resena(BaseModel):
    id: Optional[int]
    servicio_id: Optional[int]
    cliente_id: Optional[int]
    calificacion: int = Field(..., ge=1, le=5)
    comentario: Optional[str]

class Calendario(BaseModel):
    id: Optional[int]
    profesional_id: Optional[int]
    fecha: str  # Puedes usar date si prefieres
    hora_inicio: str  # Puedes usar time si prefieres
    hora_fin: str  # Puedes usar time si prefieres
    estado: Optional[str]

class Contratacion(BaseModel):
    id: Optional[int]
    cliente_id: Optional[int]
    servicio_id: Optional[int]
    fecha_contratacion: Optional[str]  # Puedes usar datetime si prefieres
    calendario_id: Optional[int]
    estado: Optional[str]

class MetodoDePago(BaseModel):
    id: Optional[int]
    cliente_id: Optional[int]
    tipo: str
    detalles: str

class Direccion(BaseModel):
    id: Optional[int]
    cliente_id: Optional[int]
    direccion: str
    ciudad: str
    codigo_postal: str


class User_Incompleto(BaseModel):
    email: str
    password: str

def get_user_credentials(email):
    # Replace with your actual database connection code
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="tpfinallab4"
    )
    cursor = db.cursor(dictionary=True)
    query = "SELECT email, password FROM users_incompletos WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    print(user)
    return user

@app.post("/login")
async def login(user: User_Incompleto):
    user_data = get_user_credentials(user.email)
    if user_data and user_data['password'] == user.password:
        return {"token": "fake-jwt-token"}
    raise HTTPException(status_code=400, detail="Invalid credentials")



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
def get_usersIncompletos():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users_incompletos")
    results = cursor.fetchall()
    return results





@app.post("/users_incompletos")
def add_userIncompleto(user_incompleto: User_Incompleto):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO users_incompletos (email, password)
        VALUES (%s, %s)
    """, (user_incompleto.email, user_incompleto.password))
    db.commit()
    return {"message": "User Incompleto added successfully"}





@app.get("/profesionales")
def get_profesionales():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM profesionales")
    results = cursor.fetchall()
    return results





@app.post("/profesionales")
def add_profesional(profesional: Profesional):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO profesionales (nombre, zona, ciudad, descripcion, calificacion_promedio)
        VALUES (%s, %s, %s, %s, %s)
    """, (profesional.nombre, profesional.zona, profesional.ciudad, profesional.descripcion, profesional.calificacion_promedio))
    db.commit()
    return {"message": "Profesional added successfully"}

# Endpoints for Clientes
@app.get("/clientes")
def get_clientes():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    results = cursor.fetchall()
    return results

@app.post("/clientes")
def add_cliente(cliente: Cliente):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO clientes (nombre, email)
        VALUES (%s, %s)
    """, (cliente.nombre, cliente.email))
    db.commit()
    return {"message": "Cliente added successfully"}

# Endpoints for Servicios
@app.get("/servicios")
def get_servicios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM servicios")
    results = cursor.fetchall()
    return results

@app.post("/servicios")
def add_servicio(servicio: Servicio):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO servicios (profesional_id, nombre, descripcion, precio)
        VALUES (%s, %s, %s, %s)
    """, (servicio.profesional_id, servicio.nombre, servicio.descripcion, servicio.precio))
    db.commit()
    return {"message": "Servicio added successfully"}

# Endpoints for Resenas
@app.get("/resenas")
def get_resenas():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM resenas")
    results = cursor.fetchall()
    return results

@app.post("/resenas")
def add_resena(resena: Resena):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO resenas (servicio_id, cliente_id, calificacion, comentario)
        VALUES (%s, %s, %s, %s)
    """, (resena.servicio_id, resena.cliente_id, resena.calificacion, resena.comentario))
    db.commit()
    return {"message": "Resena added successfully"}

# Endpoints for Calendario
@app.get("/calendario")
def get_calendario():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM calendario")
    results = cursor.fetchall()
    return results

@app.post("/calendario")
def add_calendario(calendario: Calendario):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO calendario (profesional_id, fecha, hora_inicio, hora_fin, estado)
        VALUES (%s, %s, %s, %s, %s)
    """, (calendario.profesional_id, calendario.fecha, calendario.hora_inicio, calendario.hora_fin, calendario.estado))
    db.commit()
    return {"message": "Calendario added successfully"}

# Endpoints for Contrataciones
@app.get("/contrataciones")
def get_contrataciones():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM contrataciones")
    results = cursor.fetchall()
    return results

@app.post("/contrataciones")
def add_contratacion(contratacion: Contratacion):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO contrataciones (cliente_id, servicio_id, calendario_id, estado)
        VALUES (%s, %s, %s, %s)
    """, (contratacion.cliente_id, contratacion.servicio_id, contratacion.calendario_id, contratacion.estado))
    db.commit()
    return {"message": "Contratacion added successfully"}

# Endpoints for Metodos de Pago
@app.get("/metodos_de_pago")
def get_metodos_de_pago():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM metodos_de_pago")
    results = cursor.fetchall()
    return results

@app.post("/metodos_de_pago")
def add_metodo_de_pago(metodo_de_pago: MetodoDePago):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO metodos_de_pago (cliente_id, tipo, detalles)
        VALUES (%s, %s, %s)
    """, (metodo_de_pago.cliente_id, metodo_de_pago.tipo, metodo_de_pago.detalles))
    db.commit()
    return {"message": "Metodo de Pago added successfully"}

# Endpoints for Direcciones
@app.get("/direcciones")
def get_direcciones():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM direcciones")
    results = cursor.fetchall()
    return results

@app.post("/direcciones")
def add_direccion(direccion: Direccion):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO direcciones (cliente_id, direccion, ciudad, codigo_postal)
        VALUES (%s, %s, %s, %s)
    """, (direccion.cliente_id, direccion.direccion, direccion.ciudad, direccion.codigo_postal))
    db.commit()
    return {"message": "Direccion added successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from decimal import Decimal



import mysql.connector

from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()


def get_db_connection():
    db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="laburappdb")
    
    return db


def get_user_credentials(email, db):
    # (Insert your existing database connection code here)

    cursor = db.cursor(dictionary=True)
    query = "SELECT email, password FROM users_incompletos WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    return user


from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from decimal import Decimal

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
    fecha_contratacion: Optional[str]  # Puedes usar datetime si prefieres
    calendario_id: int
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
    id: Optional[int]
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

@app.post("/categorias")
def add_categoria(categoria: Categoria):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO categorias (nombre) VALUES (%s)", (categoria.nombre,))
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
    cursor.execute("SELECT nombre FROM usuarios WHERE id = %s", (id,))
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
        INSERT INTO contrataciones (cliente_id, servicio_id, fecha_contratacion, calendario_id, estado) 
        VALUES (%s, %s, %s, %s, %s)
    """, (contratacion.cliente_id, contratacion.servicio_id, contratacion.fecha_contratacion, contratacion.calendario_id, contratacion.estado))
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



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)




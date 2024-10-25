from fastapi import FastAPI


from pydantic import BaseModel

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

# Modelo Pydantic
class User(BaseModel):
    name: str
    lastName: str
    age: int
    email: str
    address_id: int

# Modelo Pydantic
class Address(BaseModel):
    street: str
    number: int
    city: int
    country: str




    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Origen permitido
    allow_entoncescredentials=True,
    allow_methods=["*"],  # Métodos permitidos
    allow_headers=["*"],  # Encabezados permitidos
)    

@app.get("/users")
def get_users():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
    return results

@app.post("/users")
def add_user(user: User):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO users (name, lastName, age, email, address_id)
        VALUES (%s, %s, %s, %s, %s)
    """, (user.name, user.lastName, user.age, user.email, user.address_id))
    db.commit()
    return {"message": "User added successfully"}

@app.get("/addresses")
def get_addresses():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM address")
    results = cursor.fetchall()
    return results

@app.post("/addresses")
def add_address(address: Address):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO address (street, number, city, country)
        VALUES (%s, %s, %s, %s)
    """, (address.street, address.number, address.city, address.country))
    db.commit()
    return {"message": "Address added successfully"}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
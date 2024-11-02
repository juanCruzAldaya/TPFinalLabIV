import mysql.connector
from faker import Faker
import random

fake = Faker()

# Configuración de la conexión a MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="laburappdb"
)

cursor = db.cursor()

# Insertar usuarios ficticios
for _ in range(50):  # 50 usuarios ficticios
    nombre = fake.first_name()
    apellido = fake.last_name()
    email = fake.email()
    password = fake.password()
    contacto = fake.phone_number()
    ciudad = fake.city()
    calificacion_promedio = round(random.uniform(1, 5), 2)
    
    cursor.execute("""
        INSERT INTO usuarios (email, password, nombre, apellido, contacto, ciudad, calificacion_promedio)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (email, password, nombre, apellido, contacto, ciudad, calificacion_promedio))

db.commit()

# Obtener IDs de usuarios para asignar a los servicios
cursor.execute("SELECT id FROM usuarios")
usuario_ids = [row[0] for row in cursor.fetchall()]

# Obtener IDs de subcategorias para asignar a los servicios
cursor.execute("SELECT id FROM subcategorias")
subcategoria_ids = [row[0] for row in cursor.fetchall()]

# Insertar servicios ficticios
for _ in range(100):  # 100 servicios ficticios
    profesional_id = random.choice(usuario_ids)
    nombre = fake.bs()  # Generate business-style name for service
    descripcion = fake.paragraph()
    sub_categoria = random.choice(subcategoria_ids)
    provincia = fake.state()
    departamento = fake.city()
    localidad = fake.city()
    precio = round(random.uniform(20, 500), 2)
    calificacion = random.randint(1, 5)

    cursor.execute("""
        INSERT INTO servicios (profesional_id, nombre, descripcion, sub_categoria, provincia, departamento, localidad, precio, calificacion)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (profesional_id, nombre, descripcion, sub_categoria, provincia, departamento, localidad, precio, calificacion))

db.commit()
cursor.close()
db.close()

print("Datos ficticios insertados correctamente")

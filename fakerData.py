from faker import Faker
import mysql.connector

# Initialize Faker
fake = Faker()

# Configuración de la conexión a MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tpfinallab4"
)


cursor = db.cursor()
# Generate and insert data into 'clientes' table
for _ in range(25):
    nombre = fake.name()
    email = fake.email()
    
    cursor.execute("""
        INSERT INTO users_incompletos (nombre, email)
        VALUES (%s, %s)
    """, (nombre, email))


# # Generate and insert data into 'profesionales' table
# for _ in range(10):
#     nombre = fake.name()
#     zona = fake.state()
#     ciudad = fake.city()
#     descripcion = fake.text()
#     calificacion_promedio = round(fake.pyfloat(left_digits=1, right_digits=2, positive=True, min_value=1, max_value=5), 2)
    
#     cursor.execute("""
#         INSERT INTO profesionales (nombre, zona, ciudad, descripcion, calificacion_promedio)
#         VALUES (%s, %s, %s, %s, %s)
#     """, (nombre, zona, ciudad, descripcion, calificacion_promedio))

# # Generate and insert data into 'clientes' table
# for _ in range(10):
#     nombre = fake.name()
#     email = fake.email()
    
#     cursor.execute("""
#         INSERT INTO clientes (nombre, email)
#         VALUES (%s, %s)
#     """, (nombre, email))

# # Generate and insert data into 'servicios' table
# for _ in range(10):
#     profesional_id = fake.random_int(min=1, max=10)
#     nombre = fake.word()
#     descripcion = fake.text()
#     precio = round(fake.pyfloat(left_digits=3, right_digits=2, positive=True), 2)
    
#     cursor.execute("""
#         INSERT INTO servicios (profesional_id, nombre, descripcion, precio)
#         VALUES (%s, %s, %s, %s)
#     """, (profesional_id, nombre, descripcion, precio))

# # Generate and insert data into 'resenas' table
# for _ in range(10):
#     servicio_id = fake.random_int(min=1, max=10)
#     cliente_id = fake.random_int(min=1, max=10)
#     calificacion = fake.random_int(min=1, max=5)
#     comentario = fake.text()
    
#     cursor.execute("""
#         INSERT INTO resenas (servicio_id, cliente_id, calificacion, comentario)
#         VALUES (%s, %s, %s, %s)
#     """, (servicio_id, cliente_id, calificacion, comentario))

# # Generate and insert data into 'calendario' table
# for _ in range(10):
#     profesional_id = fake.random_int(min=1, max=10)
#     fecha = fake.date_this_year()
#     hora_inicio = fake.time()
#     hora_fin = fake.time()
#     estado = fake.random_element(elements=('disponible', 'reservado'))
    
#     cursor.execute("""
#         INSERT INTO calendario (profesional_id, fecha, hora_inicio, hora_fin, estado)
#         VALUES (%s, %s, %s, %s, %s)
#     """, (profesional_id, fecha, hora_inicio, hora_fin, estado))

# # Generate and insert data into 'contrataciones' table
# for _ in range(10):
#     cliente_id = fake.random_int(min=1, max=10)
#     servicio_id = fake.random_int(min=1, max=10)
#     calendario_id = fake.random_int(min=1, max=10)
#     estado = fake.random_element(elements=('pendiente', 'en_progreso', 'finalizado'))
    
#     cursor.execute("""
#         INSERT INTO contrataciones (cliente_id, servicio_id, calendario_id, estado)
#         VALUES (%s, %s, %s, %s)
#     """, (cliente_id, servicio_id, calendario_id, estado))

# # Generate and insert data into 'metodos_de_pago' table
# for _ in range(10):
#     cliente_id = fake.random_int(min=1, max=10)
#     tipo = fake.credit_card_provider()
#     detalles = fake.credit_card_number(card_type=None)
    
#     cursor.execute("""
#         INSERT INTO metodos_de_pago (cliente_id, tipo, detalles)
#         VALUES (%s, %s, %s)
#     """, (cliente_id, tipo, detalles))

# # Generate and insert data into 'direcciones' table
# for _ in range(10):
#     cliente_id = fake.random_int(min=1, max=10)
#     direccion = fake.address()
#     ciudad = fake.city()
#     codigo_postal = fake.postcode()
    
#     cursor.execute("""
#         INSERT INTO direcciones (cliente_id, direccion, ciudad, codigo_postal)
#         VALUES (%s, %s, %s, %s)
#     """, (cliente_id, direccion, ciudad, codigo_postal))

# Commit the transaction
db.commit()

# Close the connection
cursor.close()
db.close()

print("Data generation and insertion completed successfully.")

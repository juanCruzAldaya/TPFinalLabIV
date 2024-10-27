import mysql.connector


# Configuración de la conexión a MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="tpfinallab4"
)


cursor = db.cursor()

cursor.execute("""
               
CREATE TABLE users_incompletos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(30),
    password VARCHAR (30)           
    );"""
)

db.commit()

{"message": "User_Incompleto added successfully"}
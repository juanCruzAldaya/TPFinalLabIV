import mysql.connector
from mysql.connector import Error
from monitoring.app_monitor import logger


err = Error
def get_db_connection():
    """
    Establece una conexión a la base de datos MySQL.
    Devuelve la conexión si es exitosa, de lo contrario, registra el error.
    """
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="laburappdb"
        )
        return db
    except err as e:
        logger.error(f"Error connecting to the database: {e}")
        return None
import logging

# Limpiar handlers existentes
for handler in logging.root.handlers[:]:
    logging.root.removeHandler(handler)

# Configurar el logging para guardar en un archivo
logging.basicConfig(
    filename='monitoring/app.log',  # Nombre del archivo de log
    level=logging.INFO,  # Nivel de logging
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'  # Formato del log
)

# Añadir un nuevo handler para el archivo de log
file_handler = logging.FileHandler('monitoring/app.log')
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logging.root.addHandler(file_handler)

# Mensaje de prueba para confirmar que el logging está configurado correctamente
logging.info('Logging configured successfully')

# Obtener el logger
logger = logging.getLogger(__name__)
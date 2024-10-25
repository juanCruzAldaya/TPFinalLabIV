/*CREATE TABLE profesionales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    zona VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    descripcion TEXT,
    calificacion_promedio DECIMAL(3, 2)
);

CREATE TABLE clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE servicios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    profesional_id BIGINT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id)
);

CREATE TABLE resenas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    servicio_id BIGINT,
    cliente_id BIGINT,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);



CREATE TABLE calendario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    profesional_id BIGINT,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(255) CHECK (estado IN ('disponible', 'reservado')) DEFAULT 'disponible',
    FOREIGN KEY (profesional_id) REFERENCES profesionales(id)
);

CREATE TABLE contrataciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT,
    servicio_id BIGINT,
    fecha_contratacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calendario_id BIGINT,
    estado VARCHAR(255) CHECK (estado IN ('pendiente', 'en_progreso', 'finalizado')) DEFAULT 'pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (calendario_id) REFERENCES calendario(id)
);


CREATE TABLE metodos_de_pago (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT,
    tipo VARCHAR(255) NOT NULL,
    detalles TEXT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE direcciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(255) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
*/
















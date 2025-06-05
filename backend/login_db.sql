-- 1. Crear la base de datos (esto se hace una sola vez)
CREATE DATABASE login_db;

-- ⚠️ NOTA: No puedes cambiar de base de datos con SQL en PostgreSQL como en MySQL.
-- Debes abrir una nueva conexión apuntando a `login_db`.

-- 2. (Una vez conectado a `login_db`) Crear la tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,                              -- ID autoincremental
    nombre VARCHAR(100) NOT NULL,                       -- Primer nombre obligatorio
    segundo_nombre VARCHAR(100),                        -- Segundo nombre opcional
    apellidos VARCHAR(100) NOT NULL,                    -- Apellidos obligatorios
    usuario VARCHAR(50) UNIQUE NOT NULL,                -- Nombre de usuario único
    contraseña_hash VARCHAR(255) NOT NULL,              -- Contraseña hasheada
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP       -- Fecha de creación
);

-- 3. (Opcional) Insertar un usuario de ejemplo con hash de contraseña
INSERT INTO usuarios (nombre, segundo_nombre, apellidos, usuario, contraseña_hash)
VALUES (
    'Juan',
    NULL,
    'Pérez Gómez',
    'juanperez',
    '$2b$10$EjemploDeHashSeguroGENERADOporBcryptXD'  -- Reemplaza con un hash real
);

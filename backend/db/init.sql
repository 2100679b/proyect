-- Script de Base de Datos PostgreSQL - Sistema de Simulación
-- Configuración inicial de roles, usuarios y estructura de base de datos

-- ============================================
-- CREACIÓN DE ROLES Y USUARIOS
-- ============================================

-- Crear el rol administrativo
CREATE ROLE adminrole;

-- Crear usuario administrativo con contraseña encriptada
CREATE USER adminuno WITH ENCRYPTED PASSWORD 'pwod.2025' IN ROLE "adminrole";

-- Otorgar el atributo CREATEDB al rol adminrole
ALTER ROLE adminrole CREATEDB;

-- Permitir que postgres pueda usar el rol adminrole
GRANT adminrole TO postgres;

-- ============================================
-- CREACIÓN DE BASE DE DATOS
-- ============================================

CREATE DATABASE simulacion
  WITH OWNER = adminrole
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_MX.utf8'
  LC_CTYPE = 'es_MX.utf8'
  CONNECTION LIMIT = -1
  TEMPLATE = template0;

-- Otorgar todos los privilegios en la base de datos al rol adminrole
GRANT ALL PRIVILEGES ON DATABASE simulacion TO adminrole;

-- Conectar a la base de datos simulación
\c simulación

-- ============================================
-- INSTALACIÓN DE EXTENSIONES
-- ============================================

CREATE EXTENSION dblink;
CREATE EXTENSION unaccent;
CREATE EXTENSION "uuid-ossp";

-- ============================================
-- ESQUEMA DE SEGURIDAD
-- ============================================

-- Crear esquema de seguridad
CREATE SCHEMA IF NOT EXISTS seguridad AUTHORIZATION adminrole;

-- Tabla roles (sin TABLESPACE para RDS)
CREATE TABLE IF NOT EXISTS seguridad.roles (
    id integer NOT NULL primary key,
    role character varying(100) COLLATE pg_catalog."default",
    perfil json[],
    descripcion text COLLATE pg_catalog."default",
    fecha_registro timestamp not null default current_timestamp
);

-- Configurar propietario y permisos para tabla roles
ALTER TABLE seguridad.roles OWNER to adminrole;
GRANT ALL ON TABLE seguridad.roles TO adminrole;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS seguridad.usuarios (
    id serial NOT NULL PRIMARY KEY,
    nombre character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    roles integer[],
    registro_fecha timestamp not null default current_timestamp,
    registro_usuario integer not null default 0,
    constraint uk_nombre_usuarios unique (nombre)
);

-- Configurar propietario y permisos para tabla usuarios
ALTER TABLE seguridad.usuarios OWNER to adminrole;
GRANT ALL ON TABLE seguridad.usuarios TO adminrole;

-- ============================================
-- ESQUEMA DE SISTEMAS
-- ============================================

-- Crear esquema de sistemas
CREATE SCHEMA IF NOT EXISTS sistemas AUTHORIZATION adminrole;

-- Tabla dispositivos (con constraint corregido)
CREATE TABLE IF NOT EXISTS sistemas.dispositivos (
    id serial NOT NULL PRIMARY KEY,
    nombre character varying(100) NOT NULL,
    ubicacion character varying(100) NOT NULL,
    coordenadas character varying(100) NOT NULL,
    potencia json,
    voltaje json,
    corriente json,
    caudal json,
    estado integer not null default 1,
    registro_fecha timestamp not null default current_timestamp,
    registro_usuario integer not null default 0,
    constraint uk_nombre unique (nombre)  -- Constraint corregido
);

-- Configurar propietario y permisos para tabla dispositivos
ALTER TABLE sistemas.dispositivos OWNER to adminrole;
GRANT ALL ON TABLE sistemas.dispositivos TO adminrole;
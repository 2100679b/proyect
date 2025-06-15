const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

// Registro de usuario
router.post('/register', async (req, res) => {
  const {
    username,
    nombre,
    segundo_nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    contrasena
  } = req.body;

  try {
    // Construir nombre completo
    const nombreCompleto = [nombre, segundo_nombre, apellido_paterno, apellido_materno]
      .filter(Boolean) // Elimina valores null/undefined/vacíos
      .join(' ');

    // Verifica si ya existe el usuario o nombre
    const check = await db.query(
      `SELECT id FROM seguridad.usuarios WHERE username = $1 OR nombre = $2`,
      [username, nombreCompleto]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ mensaje: 'El usuario o nombre ya existe' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario - Usar ARRAY[] para el campo roles que es integer[]
    const result = await db.query(
      `INSERT INTO seguridad.usuarios (
        username, nombre, password, roles, registro_usuario
      ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [
        username,
        nombreCompleto,
        hashedPassword,
        [1], // Array de enteros para roles
        0    // Usuario registrado por el sistema
      ]
    );

    console.log('Usuario registrado con ID:', result.rows[0].id);
    res.status(201).json({ 
      mensaje: 'Usuario registrado correctamente',
      usuario_id: result.rows[0].id 
    });

  } catch (error) {
    console.error('Error detallado al registrar usuario:', error);
    
    // Manejo específico de errores de PostgreSQL
    if (error.code === '23505') { // Violación de constraint único
      return res.status(409).json({ mensaje: 'El usuario o nombre ya existe' });
    }
    
    if (error.code === '23502') { // Campo NOT NULL violado
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    res.status(500).json({ 
      mensaje: 'Error del servidor al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
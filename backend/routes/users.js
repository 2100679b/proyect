const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =====================
// REGISTRO
// =====================
router.post('/register', async (req, res) => {
  const { nombre, username, password, roles = [1], registro_usuario = 0 } = req.body;

  try {
    // Validación de entrada
    if (!nombre || !username || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Verificar si ya existe el username
    const existe = await db.query(
      `SELECT * FROM seguridad.usuarios WHERE username = $1`,
      [username]
    );

    if (existe.rowCount > 0) {
      return res.status(409).json({ error: 'El nombre de usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const newUser = await db.query(
      `INSERT INTO seguridad.usuarios (nombre, username, password, roles, registro_usuario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, username, roles, registro_usuario`,
      [nombre, username, hashedPassword, roles, registro_usuario]
    );

    // Generar token JWT
    const token = generateToken(newUser.rows[0]);

    res.status(201).json({ 
      mensaje: '✅ Usuario registrado correctamente',
      usuario: newUser.rows[0],
      token
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// =====================
// LOGIN
// =====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM seguridad.usuarios WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generar token JWT
    const token = generateToken(user);

    // Omitir password en la respuesta
    delete user.password;

    res.json({
      mensaje: `Bienvenido, ${user.nombre}`,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        username: user.username,
        roles: user.roles
      },
      token
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// =====================
// LISTADO DE USUARIOS (Protegido)
// =====================
router.get('/', authenticateToken, authorizeRoles([1]), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nombre, username, roles FROM seguridad.usuarios'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// =====================
// OBTENER USUARIO POR ID (Protegido)
// =====================
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, nombre, username, roles FROM seguridad.usuarios WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// =====================
// ACTUALIZAR USUARIO (Protegido)
// =====================
router.put('/:id', authenticateToken, async (req, res) => {
  const { nombre, username, roles } = req.body;
  const userId = req.params.id;

  try {
    // Verificar si el usuario existe
    const userExists = await db.query(
      'SELECT * FROM seguridad.usuarios WHERE id = $1',
      [userId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar usuario
    const updatedUser = await db.query(
      `UPDATE seguridad.usuarios 
       SET nombre = $1, username = $2, roles = $3 
       WHERE id = $4
       RETURNING id, nombre, username, roles`,
      [nombre, username, roles, userId]
    );

    res.json({
      mensaje: '✅ Usuario actualizado correctamente',
      usuario: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// =====================
// ELIMINAR USUARIO (Protegido)
// =====================
router.delete('/:id', authenticateToken, authorizeRoles([1]), async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM seguridad.usuarios WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: '✅ Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// =====================
// FUNCIÓN PARA GENERAR TOKEN JWT
// =====================
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      roles: user.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// =====================
// MIDDLEWARE DE AUTENTICACIÓN
// =====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    
    req.user = user;
    next();
  });
}

// =====================
// MIDDLEWARE DE AUTORIZACIÓN POR ROLES
// =====================
function authorizeRoles(requiredRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    
    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasPermission = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'No tienes permiso para realizar esta acción' 
      });
    }
    
    next();
  };
}

module.exports = router;
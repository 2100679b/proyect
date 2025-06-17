const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// ============================================
// REGISTRO DE USUARIO + DISPOSITIVO ASOCIADO
// ============================================
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const hashed = await bcrypt.hash(password, 10);

    const userResult = await client.query(`
      INSERT INTO seguridad.usuarios (email, username, password, roles, registro_usuario)
      VALUES ($1, $2, $3, ARRAY[1], 0)
      RETURNING id, email, username
    `, [email, username, hashed]);

    const newUser = userResult.rows[0];

    await client.query(`
      INSERT INTO sistemas.dispositivos (nombre, ubicacion, coordenadas, estado, registro_usuario)
      VALUES ($1, 'Ubicación no especificada', '0,0', 1, $2)
    `, [`Dispositivo de ${newUser.email}`, newUser.id]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Usuario y dispositivo creados con éxito',
      user: newUser
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en registro:', error);

    if (error.code === '23505') {
      res.status(409).json({ error: 'El correo o nombre de usuario ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  } finally {
    client.release();
  }
});

// ============================================
// LOGIN
// ============================================
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const field = identifier.includes('@') ? 'email' : 'username';
    const result = await db.query(
      `SELECT * FROM seguridad.usuarios WHERE ${field} = $1 LIMIT 1`,
      [identifier]
    );

    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, username: user.username, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en inicio de sesión' });
  }
});

// ============================================
// CRUD DE DISPOSITIVOS
// ============================================

// Crear dispositivo
router.post('/dispositivos', verifyToken, async (req, res) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(`
      INSERT INTO sistemas.dispositivos (
        nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, 
        estado, registro_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8)
      RETURNING *
    `, [
      nombre,
      ubicacion || 'Ubicación no especificada',
      coordenadas || '0,0',
      potencia ? JSON.stringify(potencia) : null,
      voltaje ? JSON.stringify(voltaje) : null,
      corriente ? JSON.stringify(corriente) : null,
      caudal ? JSON.stringify(caudal) : null,
      userId
    ]);

    res.status(201).json({
      message: 'Dispositivo creado con éxito',
      dispositivo: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear dispositivo:', error);
    if (error.code === '23505') {
      res.status(409).json({ error: 'Ya existe un dispositivo con ese nombre' });
    } else {
      res.status(500).json({ error: 'Error al crear dispositivo' });
    }
  }
});

// Obtener todos los dispositivos
router.get('/dispositivos', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM sistemas.dispositivos
      WHERE registro_usuario = $1
      ORDER BY registro_fecha DESC
    `, [req.user.id]);

    res.json({
      message: 'Dispositivos obtenidos con éxito',
      dispositivos: result.rows
    });
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).json({ error: 'Error al obtener dispositivos' });
  }
});

// Obtener un dispositivo específico
router.get('/dispositivos/:id', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM sistemas.dispositivos
      WHERE id = $1 AND registro_usuario = $2
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json({
      message: 'Dispositivo obtenido con éxito',
      dispositivo: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener dispositivo:', error);
    res.status(500).json({ error: 'Error al obtener dispositivo' });
  }
});

// Actualizar dispositivo
router.put('/dispositivos/:id', verifyToken, async (req, res) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado } = req.body;

  try {
    const result = await db.query(`
      UPDATE sistemas.dispositivos 
      SET nombre = $1, ubicacion = $2, coordenadas = $3, 
          potencia = $4, voltaje = $5, corriente = $6, caudal = $7, estado = $8
      WHERE id = $9 AND registro_usuario = $10
      RETURNING *
    `, [
      nombre,
      ubicacion,
      coordenadas,
      potencia ? JSON.stringify(potencia) : null,
      voltaje ? JSON.stringify(voltaje) : null,
      corriente ? JSON.stringify(corriente) : null,
      caudal ? JSON.stringify(caudal) : null,
      estado !== undefined ? estado : 1,
      req.params.id,
      req.user.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json({
      message: 'Dispositivo actualizado con éxito',
      dispositivo: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
    res.status(500).json({ error: 'Error al actualizar dispositivo' });
  }
});

// Eliminar (desactivar) dispositivo
router.delete('/dispositivos/:id', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      UPDATE sistemas.dispositivos 
      SET estado = 0
      WHERE id = $1 AND registro_usuario = $2
      RETURNING id, nombre
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json({
      message: 'Dispositivo eliminado con éxito',
      dispositivo: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error);
    res.status(500).json({ error: 'Error al eliminar dispositivo' });
  }
});

// Estadísticas por usuario
router.get('/dispositivos/stats/resumen', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) AS total_dispositivos,
        COUNT(CASE WHEN estado = 1 THEN 1 END) AS dispositivos_activos,
        COUNT(CASE WHEN estado = 0 THEN 1 END) AS dispositivos_inactivos
      FROM sistemas.dispositivos 
      WHERE registro_usuario = $1
    `, [req.user.id]);

    res.json({
      message: 'Estadísticas obtenidas con éxito',
      estadisticas: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;

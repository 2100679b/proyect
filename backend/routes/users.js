const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Asumo que exporta un pool de pg
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Validación de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de coordenadas
const isValidCoordinates = (coordinates) => {
  if (!coordinates) return true; // Opcional
  const coordRegex = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
  return coordRegex.test(coordinates);
};

// REGISTRO DE USUARIO + DISPOSITIVO ASOCIADO
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  // Validaciones básicas
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Encriptar contraseña
    const hashed = await bcrypt.hash(password, 12); // Aumenté las rondas a 12

    // Insertar usuario
    const insertUserQuery = `
      INSERT INTO seguridad.usuarios (email, username, password, roles, registro_usuario)
      VALUES ($1, $2, $3, $4, 0)
      RETURNING id, email, username, registro_fecha
    `;
    const userResult = await client.query(insertUserQuery, [
      email.toLowerCase().trim(),
      username.trim(),
      hashed,
      [1], // roles como arreglo
    ]);
    const newUser = userResult.rows[0];

    // Insertar dispositivo asociado
    const insertDeviceQuery = `
      INSERT INTO sistemas.dispositivos (nombre, ubicacion, coordenadas, estado, registro_usuario)
      VALUES ($1, $2, $3, 1, $4)
      RETURNING id, nombre
    `;
    const deviceName = `Dispositivo principal de ${newUser.username}`;
    const deviceResult = await client.query(insertDeviceQuery, [
      deviceName, 
      'Ubicación no especificada', 
      '0,0', 
      newUser.id
    ]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Usuario y dispositivo creados con éxito',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        registro_fecha: newUser.registro_fecha
      },
      dispositivo: deviceResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en registro:', error);

    if (error.code === '23505') {
      if (error.constraint === 'uk_email') {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
      }
      if (error.constraint === 'uk_username') {
        return res.status(409).json({ error: 'El nombre de usuario ya está registrado' });
      }
      return res.status(409).json({ error: 'El correo o nombre de usuario ya está registrado' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const field = identifier.includes('@') ? 'email' : 'username';
    const searchValue = field === 'email' ? identifier.toLowerCase().trim() : identifier.trim();

    const query = `
      SELECT id, email, username, password, roles
      FROM seguridad.usuarios
      WHERE ${field} = $1
      LIMIT 1
    `;

    const result = await db.query(query, [searchValue]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        roles: user.roles 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Aumenté el tiempo de expiración
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// CRUD DISPOSITIVOS
// Crear dispositivo
router.post('/dispositivos', verifyToken, async (req, res) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal } = req.body;
  const userId = req.user.id;

  // Validaciones
  if (!nombre || nombre.trim().length === 0) {
    return res.status(400).json({ error: 'El nombre del dispositivo es obligatorio' });
  }

  if (coordenadas && !isValidCoordinates(coordenadas)) {
    return res.status(400).json({ error: 'Formato de coordenadas inválido (use: lat,lng)' });
  }

  try {
    const query = `
      INSERT INTO sistemas.dispositivos (
        nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado, registro_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, $8)
      RETURNING *
    `;

    const result = await db.query(query, [
      nombre.trim(),
      ubicacion?.trim() || 'Ubicación no especificada',
      coordenadas || '0,0',
      potencia ? JSON.stringify(potencia) : null,
      voltaje ? JSON.stringify(voltaje) : null,
      corriente ? JSON.stringify(corriente) : null,
      caudal ? JSON.stringify(caudal) : null,
      userId,
    ]);

    res.status(201).json({
      message: 'Dispositivo creado con éxito',
      dispositivo: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear dispositivo:', error);

    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un dispositivo con ese nombre' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los dispositivos con paginación
router.get('/dispositivos', verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Consulta para obtener dispositivos con paginación
    const dispositivosQuery = `
      SELECT * FROM sistemas.dispositivos
      WHERE registro_usuario = $1
      ORDER BY registro_fecha DESC
      LIMIT $2 OFFSET $3
    `;
    
    // Consulta para contar total de dispositivos
    const countQuery = `
      SELECT COUNT(*) as total FROM sistemas.dispositivos
      WHERE registro_usuario = $1
    `;

    const [dispositivosResult, countResult] = await Promise.all([
      db.query(dispositivosQuery, [req.user.id, limit, offset]),
      db.query(countQuery, [req.user.id])
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      message: 'Dispositivos obtenidos con éxito',
      dispositivos: dispositivosResult.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error al obtener dispositivos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener dispositivo específico
router.get('/dispositivos/:id', verifyToken, async (req, res) => {
  const deviceId = parseInt(req.params.id);
  
  if (isNaN(deviceId)) {
    return res.status(400).json({ error: 'ID de dispositivo inválido' });
  }

  try {
    const result = await db.query(`
      SELECT * FROM sistemas.dispositivos
      WHERE id = $1 AND registro_usuario = $2
    `, [deviceId, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json({
      message: 'Dispositivo obtenido con éxito',
      dispositivo: result.rows[0],
    });
  } catch (error) {
    console.error('Error al obtener dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar dispositivo
router.put('/dispositivos/:id', verifyToken, async (req, res) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado } = req.body;
  const deviceId = parseInt(req.params.id);
  
  if (isNaN(deviceId)) {
    return res.status(400).json({ error: 'ID de dispositivo inválido' });
  }

  // Validaciones
  if (nombre && nombre.trim().length === 0) {
    return res.status(400).json({ error: 'El nombre del dispositivo no puede estar vacío' });
  }

  if (coordenadas && !isValidCoordinates(coordenadas)) {
    return res.status(400).json({ error: 'Formato de coordenadas inválido (use: lat,lng)' });
  }

  if (estado !== undefined && ![0, 1].includes(estado)) {
    return res.status(400).json({ error: 'El estado debe ser 0 (inactivo) o 1 (activo)' });
  }

  try {
    const result = await db.query(`
      UPDATE sistemas.dispositivos 
      SET nombre = $1, ubicacion = $2, coordenadas = $3, 
          potencia = $4, voltaje = $5, corriente = $6, caudal = $7, estado = $8
      WHERE id = $9 AND registro_usuario = $10
      RETURNING *
    `, [
      nombre?.trim(),
      ubicacion?.trim(),
      coordenadas,
      potencia ? JSON.stringify(potencia) : null,
      voltaje ? JSON.stringify(voltaje) : null,
      corriente ? JSON.stringify(corriente) : null,
      caudal ? JSON.stringify(caudal) : null,
      estado !== undefined ? estado : 1,
      deviceId,
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json({
      message: 'Dispositivo actualizado con éxito',
      dispositivo: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un dispositivo con ese nombre' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar (desactivar) dispositivo
router.delete('/dispositivos/:id', verifyToken, async (req, res) => {
  const deviceId = parseInt(req.params.id);
  
  if (isNaN(deviceId)) {
    return res.status(400).json({ error: 'ID de dispositivo inválido' });
  }

  try {
    const result = await db.query(`
      UPDATE sistemas.dispositivos 
      SET estado = 0
      WHERE id = $1 AND registro_usuario = $2 AND estado = 1
      RETURNING id, nombre
    `, [deviceId, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado o ya está inactivo' });
    }

    res.json({
      message: 'Dispositivo desactivado con éxito',
      dispositivo: result.rows[0],
    });
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Reactivar dispositivo
router.patch('/dispositivos/:id/reactivar', verifyToken, async (req, res) => {
  const deviceId = parseInt(req.params.id);
  
  if (isNaN(deviceId)) {
    return res.status(400).json({ error: 'ID de dispositivo inválido' });
  }

  try {
    const result = await db.query(`
      UPDATE sistemas.dispositivos 
      SET estado = 1
      WHERE id = $1 AND registro_usuario = $2 AND estado = 0
      RETURNING id, nombre
    `, [deviceId, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado o ya está activo' });
    }

    res.json({
      message: 'Dispositivo reactivado con éxito',
      dispositivo: result.rows[0],
    });
  } catch (error) {
    console.error('Error al reactivar dispositivo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Estadísticas de dispositivos
router.get('/dispositivos/stats/resumen', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) AS total_dispositivos,
        COUNT(CASE WHEN estado = 1 THEN 1 END) AS dispositivos_activos,
        COUNT(CASE WHEN estado = 0 THEN 1 END) AS dispositivos_inactivos,
        MIN(registro_fecha) AS primer_dispositivo,
        MAX(registro_fecha) AS ultimo_dispositivo
      FROM sistemas.dispositivos 
      WHERE registro_usuario = $1
    `, [req.user.id]);

    const stats = result.rows[0];
    
    res.json({
      message: 'Estadísticas obtenidas con éxito',
      estadisticas: {
        total_dispositivos: parseInt(stats.total_dispositivos),
        dispositivos_activos: parseInt(stats.dispositivos_activos),
        dispositivos_inactivos: parseInt(stats.dispositivos_inactivos),
        primer_dispositivo: stats.primer_dispositivo,
        ultimo_dispositivo: stats.ultimo_dispositivo
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener perfil del usuario
router.get('/perfil', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, email, username, roles, registro_fecha
      FROM seguridad.usuarios
      WHERE id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil obtenido con éxito',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Cambiar contraseña
router.put('/cambiar-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Se requiere la contraseña actual y la nueva' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Verificar contraseña actual
    const userResult = await db.query(`
      SELECT password FROM seguridad.usuarios WHERE id = $1
    `, [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const validCurrentPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!validCurrentPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Actualizar contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db.query(`
      UPDATE seguridad.usuarios 
      SET password = $1 
      WHERE id = $2
    `, [hashedNewPassword, req.user.id]);

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
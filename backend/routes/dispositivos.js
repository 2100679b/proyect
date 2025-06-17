const express = require('express');
const router = express.Router();
const db = require('../db/db');
const auth = require('../middleware/auth'); // Middleware de autenticación

// Crear nuevo dispositivo
router.post('/', auth, async (req, res) => {
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal } = req.body;
  const userId = req.user.id; // ID del usuario autenticado

  try {
    // Convertir objetos a JSON para PostgreSQL
    const potenciaJson = potencia ? JSON.stringify(potencia) : null;
    const voltajeJson = voltaje ? JSON.stringify(voltaje) : null;
    const corrienteJson = corriente ? JSON.stringify(corriente) : null;
    const caudalJson = caudal ? JSON.stringify(caudal) : null;

    const result = await db.query(
      `INSERT INTO sistemas.dispositivo (
        nombre, ubicacion, coordenadas, 
        potencia, voltaje, corriente, caudal,
        registro_usuario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        nombre, 
        ubicacion, 
        coordenadas,
        potenciaJson,
        voltajeJson,
        corrienteJson,
        caudalJson,
        userId
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando dispositivo:', error);
    
    if (error.code === '23505') { // Violación de unique constraint
      return res.status(400).json({ error: 'El nombre del dispositivo ya existe' });
    }
    
    res.status(500).json({ error: 'Error al crear dispositivo' });
  }
});

// Obtener todos los dispositivos
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM sistemas.dispositivo`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo dispositivos:', error);
    res.status(500).json({ error: 'Error al obtener dispositivos' });
  }
});

// Actualizar dispositivo
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion, coordenadas, potencia, voltaje, corriente, caudal, estado } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `UPDATE sistemas.dispositivo
       SET nombre = $1, ubicacion = $2, coordenadas = $3,
           potencia = $4, voltaje = $5, corriente = $6, caudal = $7,
           estado = $8, registro_usuario = $9
       WHERE id = $10
       RETURNING *`,
      [
        nombre,
        ubicacion,
        coordenadas,
        JSON.stringify(potencia),
        JSON.stringify(voltaje),
        JSON.stringify(corriente),
        JSON.stringify(caudal),
        estado,
        userId,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando dispositivo:', error);
    res.status(500).json({ error: 'Error al actualizar dispositivo' });
  }
});

// Eliminar dispositivo (eliminación lógica)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `UPDATE sistemas.dispositivo
       SET estado = 0, registro_usuario = $1
       WHERE id = $2
       RETURNING id, nombre, estado`,
      [userId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    res.json({ 
      message: 'Dispositivo desactivado',
      dispositivo: result.rows[0]
    });
  } catch (error) {
    console.error('Error desactivando dispositivo:', error);
    res.status(500).json({ error: 'Error al desactivar dispositivo' });
  }
});

module.exports = router;
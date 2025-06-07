const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// Configura aquí tus datos de conexión
const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_basedatos',
  password: 'tu_contraseña',
  port: 5432,
})

const JWT_SECRET = 'tu_clave_secreta_aqui'

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena } = req.body

  if (!username || !nombre || !apellido_paterno || !apellido_materno || !correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' })
  }

  try {
    // Verificar si username o correo ya existen
    const existingUser = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1 OR correo = $2',
      [username, correo]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Nombre de usuario o correo ya están registrados' })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10)

    // Insertar nuevo usuario
    await pool.query(
      `INSERT INTO usuarios 
        (username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)`,
      [username, nombre, segundo_nombre || null, apellido_paterno, apellido_materno, correo, hashedPassword]
    )

    res.json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Login de usuario
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' })
  }

  try {
    const userResult = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo])

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Correo no registrado' })
    }

    const user = userResult.rows[0]

    const validPassword = await bcrypt.compare(contrasena, user.contrasena)
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' })
    }

    // Crear token JWT con datos que quieras exponer (ojo con no enviar contraseña)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        correo: user.correo
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ message: 'Login exitoso', token, user: { id: user.id, username: user.username, nombre: user.nombre, correo: user.correo } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})

// Ejemplo básico de endpoints con Express
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // 1. Validar datos
    // 2. Verificar si el usuario/email ya existe
    // 3. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 4. Guardar en la base de datos
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // 1. Buscar usuario por email o username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // 2. Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // 3. Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

<style scoped src="./login.css"></style>
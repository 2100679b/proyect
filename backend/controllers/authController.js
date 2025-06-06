const User = require('../models/User');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');
const { generateToken } = require('../config/auth');

const register = async (req, res) => {
  try {
    const { nombre, segundo_nombre, apellidos, usuario, password } = req.body;

    // Validar si el usuario ya existe
    const existingUser = await User.findByUsername(usuario);
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    // Encriptar contraseña
    const password_hash = await hashPassword(password);

    // Crear usuario
    const newUser = await User.create(
      nombre,
      segundo_nombre || null,
      apellidos,
      usuario,
      password_hash
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        usuario: newUser.usuario,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // Buscar usuario por nombre de usuario
    const user = await User.findByUsername(usuario);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await comparePasswords(password, user.contraseña_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = generateToken(user.id);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { register, login };

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); // Esto es una función middleware

// Registro de usuario
router.post('/register', authController.register);

// Inicio de sesión
router.post('/login', authController.login);

// Ruta protegida de ejemplo (usa middleware directamente)
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', user: req.user });
});

module.exports = router;

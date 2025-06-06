const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Registro
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Ruta protegida
router.get('/perfil', authMiddleware.authenticate, (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});

module.exports = router;

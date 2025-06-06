const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Acceso no autorizado: token no proporcionado' });
    }

    // Extraer token del header (formato: "Bearer <token>")
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado: token vacío' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Error de autenticación:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = { authenticate };

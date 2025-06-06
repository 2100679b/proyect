const { verifyToken } = require('../config/auth');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token faltante.' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Puedes usar esto en las rutas protegidas
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authenticate;

const express = require('express');
const app = express();
const usersRouter = require('./routes/users'); // Ajusta la ruta según tu estructura

// Middleware para parsear JSON
app.use(express.json());

// Montar el router de usuarios
app.use('/api/users', usersRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
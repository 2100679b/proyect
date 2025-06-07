// daemon.js
const app = require('./index'); // o './server' si tu backend empieza ahí

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

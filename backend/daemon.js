// index.js (o server.js)
const express = require('express');
const app = express();
// const registerRoutes = require('./routes/register'); // Asegúrate de importar tus rutas de registro

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // También útil para formularios

// Habilita CORS si es necesario (para que tu frontend pueda comunicarse con el backend)
// ¡Asegúrate de configurar esto correctamente para producción!
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Considera cambiar '*' a tu dominio específico en producción
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Define tus rutas API aquí
// Ejemplo de una ruta de registro (asumiendo que está en este archivo o importada)
// Si tienes tus rutas en un archivo separado, asegúrate de cargarlas así:
// app.use('/api', registerRoutes);

// --- INICIO: LÓGICA DE TU RUTA /api/register ---
// Si tu ruta está directamente aquí:
app.post('/api/register', async (req, res, next) => {
    // console.log para depuración, aparecerá en web-out.log
    console.log('📤 Recibiendo solicitud de registro. Datos:', req.body);
    try {
        const { email, password, username } = req.body; // Asumiendo estos campos
        
        // --- VALIDACIÓN Y LÓGICA DE NEGOCIO ---
        if (!email || !password || !username) {
            // Un error 400 es más apropiado para datos faltantes del cliente
            return res.status(400).json({ message: 'Todos los campos (email, password, username) son requeridos.' });
        }

        // Aquí iría tu lógica para interactuar con la base de datos
        // Por ejemplo, con Mongoose:
        // const User = require('./models/User'); // Asegúrate de tener tu modelo
        // const hashedPassword = await bcrypt.hash(password, 10); // Ejemplo con bcrypt
        // const newUser = new User({ email, password: hashedPassword, username });
        // await newUser.save();

        // ** Simulando un error en la base de datos para ver el log **
        // Descomenta la siguiente línea para simular un error 500 y ver cómo se registra
        // throw new Error('Error simulado al guardar en la base de datos.');

        // Si todo sale bien
        console.log(`✅ Usuario ${username} registrado exitosamente.`);
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (error) {
        // ⚠️ IMPORTANTE: Aquí pasamos el error al siguiente middleware (el manejador de errores global)
        // console.error() aquí también es útil para ver el error de inmediato
        console.error('❌ Error capturado en /api/register:', error);
        next(error); // Pasa el error al middleware de errores general de Express
    }
});
// --- FIN: LÓGICA DE TU RUTA /api/register ---

// --- INICIO: MIDDLEWARE DE MANEJO DE ERRORES GLOBAL DE EXPRESS ---
// ESTE MIDDLEWARE DEBE SER EL ÚLTIMO DESPUÉS DE TODAS TUS RUTAS Y OTROS MIDDLEWARES
app.use((err, req, res, next) => {
    // ⚠️ ¡ESTA ES LA LÍNEA MÁS IMPORTANTE PARA LA DEPURACIÓN!
    // Imprimirá el stack trace completo del error en tu web-out.log (o web-error.log)
    console.error('🔥 Error interno del servidor (capturado por middleware):', err.stack || err);

    // Asegúrate de que la respuesta aún no haya sido enviada
    if (res.headersSent) {
        return next(err); // Pasa a otro manejador de errores si existe
    }

    // Envía una respuesta 500 al cliente
    // En producción, no es buena idea enviar los detalles completos del error al cliente.
    const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Ocurrió un error interno del servidor.' 
        : err.message; // En desarrollo, puedes enviar el mensaje de error

    res.status(500).json({
        message: errorMessage,
        // Solo envía el stack trace en desarrollo, nunca en producción por seguridad
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }) 
    });
});
// --- FIN: MIDDLEWARE DE MANEJO DE ERRORES GLOBAL DE EXPRESS ---


// Exporta la aplicación Express para que daemon.js pueda cargarla
module.exports = app;
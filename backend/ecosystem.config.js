// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'simulacion-api',
      script: './daemon.js',
      instances: 1, // Puedes usar 'max' para usar todos los núcleos
      autorestart: true,
      watch: false, // pon true si estás en desarrollo y quieres reinicios automáticos
      max_memory_restart: '512M',

      // Variables de entorno (puedes omitir esto si usas .env)
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },

      // Logs
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true // agrega timestamp en los logs
    }
  ]
};

const dotenv = require('dotenv');
dotenv.config();

// Exporta las variables que necesites (opcional, pero buena práctica)
module.exports = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'default_super_secret_PARA_CAMBIAR',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@example.com',
};
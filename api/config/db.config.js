const { PrismaClient } = require('@prisma/client');

// Uúnica instancia de PrismaClient para ser usada en toda la aplicación
const prisma = new PrismaClient({
    // Opcional: logs para debugging
    // log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
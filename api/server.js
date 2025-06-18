const { PORT } = require('./config/env.config'); // Carga de las variables de entorno
const app = require('./app');
const prisma = require('./config/db.config'); // Importación de la configuración de la base de datos

async function main() {
    try {
        await prisma.$connect();
        console.log('Conectado a la base de datos correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1); 
    }

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
        console.log(`API disponible en http://localhost:${PORT}`);
    });
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
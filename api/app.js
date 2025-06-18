const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 
// const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API del Sistema de Reserva de Laboratorios funcionando!');
});

// Rutas de la API 
app.use('/api/v1', routes);

// // Manejo de errores 
// app.use(errorHandler);

module.exports = app;
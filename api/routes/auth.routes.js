const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware'); // Middleware de validación
const { registerUserSchema, loginUserSchema } = require('../schemas/auth.schema'); // Esquemas Zod

const router = express.Router(); // Crea una instancia del enrutador de Express

// Ruta para registrar un nuevo usuario
// POST /api/v1/auth/register
router.post('/register',validate(registerUserSchema), authController.registerController);

// Ruta para iniciar sesión
// POST /api/v1/auth/login
router.post('/login',validate(loginUserSchema),authController.loginController);

module.exports = router; // Exporta el enrutador para ser usado en app.js
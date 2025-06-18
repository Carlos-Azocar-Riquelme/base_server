const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env.config');
const prisma = require('../config/db.config');

const registerController = async (req, res) => {
    try {
        const { run, email, password, firstName, lastName, role = 'USER' } = req.body;

        console.log("este es mi body en el controller dentro de try", req.body);

        // Verificar si el RUN ya existe
        const existingUserByRun = await prisma.user.findUnique({
            where: { run }
        });

        if (existingUserByRun) {
            return res.status(400).json({
                success: false,
                message: 'El RUN ya está registrado'
            });
        }

        // Verificar si el email ya existe
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                run,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role
            }
        });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                id: user.id,
                run: user.run,
                email: user.email,
                firstName: user.nombre,
                lastName: user.apellido,
                role: user.role
            }
        });
    } catch (error) {
        console.log("este es mi error en el controller dentro de try", error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario'
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { run, password } = req.body;

        // Buscar usuario por RUN
        const user = await prisma.user.findUnique({
            where: { run }
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: 'RUN o contraseña inválidos'
            });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: user.id,
                run: user.run,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    run: user.run,
                    email: user.email,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

const getProfileController = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                run: true,
                email: true,
                nombre: true,
                apellido: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil'
        });
    }
};

module.exports = {
    registerController,
    loginController,
    getProfileController
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db.config'); // Tu cliente Prisma
const { AppError } = require('../utils/AppError'); // Tu clase de error
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env.config'); 

/**
 * Función auxiliar para limpiar un RUT chileno.
 * Ej: "12.345.678-9" -> "12345678"
 * @param {string} run - El RUT con formato.
 * @returns {string} El RUT numérico sin dígito verificador.
 */
const cleanRun = (run) => {
    if (typeof run !== 'string') return '';
    return run.replace(/[\.\-]/g, '').slice(0, -1);
};

/**
 * Registra un nuevo usuario en el sistema usando su RUT.
 * @param {object} userData - Datos del usuario (run, email, password, firstName, lastName, role).
 * @returns {Promise<object>} El usuario creado (sin la contraseña).
 * @throws {AppError} Si el RUT o el email ya existen.
 */
const registerUserService = async (userData) => {
    const { run, email, password, firstName, lastName, role } = userData;

    console.log("userData en el service", userData);

    console.log("este es mi userData", userData);

    // 1. Limpiar el RUT para la consulta a la BD
    const cleanedRun = cleanRun(run);

    // 2. Verificar si el RUT o el email ya existen
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ run: cleanedRun }, { email: email }],
        },
    });

    if (existingUser) {
        if (existingUser.run === cleanedRun) {
            throw new AppError('El RUN ya se encuentra registrado', 409); // 409 Conflict
        }
        throw new AppError('El correo electrónico ya se encuentra registrado', 409);
    }

    // 3. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
        data: {
            run: cleanedRun,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'USER', // Rol por defecto es USER
        },
    });

    // 5. No devolver la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

/**
 * Inicia sesión para un usuario existente usando su RUT.
 * @param {object} credentials - Credenciales del usuario (run, password).
 * @returns {Promise<object>} Objeto con el token JWT y los datos del usuario.
 * @throws {AppError} Si las credenciales son inválidas.
 */
const loginUserService = async (credentials) => {
    const { run, password } = credentials;

    // 1. Limpiar el RUT para la consulta
    const cleanedRun = cleanRun(run);

    // 2. Buscar al usuario por su RUT limpio
    const user = await prisma.user.findUnique({
        where: { run: cleanedRun },
    });

    // 3. Verificar que el usuario exista y la contraseña sea correcta
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Credenciales inválidas', 401); // 401 Unauthorized
    }

    // 4. Crear el payload y firmar el token JWT
    const tokenPayload = {
        userId: user.id,
        role: user.role,
        run: user.run, // Puedes incluir el run en el token si es útil
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    // 5. Devolver el token y los datos del usuario (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};

module.exports = {
    registerUser,
    loginUser,
};
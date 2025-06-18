const { z } = require('zod');

// --- Esquema para el REGISTRO ---

// 1. Define el esquema para el CUERPO (body) de la petición de registro
const registerBodySchema = z.object({
    run: z.string({ required_error: 'El RUN es requerido' })
        .regex(/^[0-9]{7,8}$/, 'El RUN debe tener 7 u 8 dígitos sin puntos, guion ni dígito verificador'),
    email: z.string({ required_error: 'El email es requerido' })
        .email('Formato de correo electrónico inválido'),
    password: z.string({ required_error: 'La contraseña es requerida' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    firstName: z.string({ required_error: 'El nombre es requerido' })
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string({ required_error: 'El apellido es requerido' })
        .min(2, 'El apellido debe tener al menos 2 caracteres')
});

// 2. Define el esquema COMPLETO que el middleware 'validate' usará
const registerUserSchema = z.object({
    body: registerBodySchema, // Le decimos a Zod que valide el objeto anidado 'body'
});


// --- Esquema para el LOGIN ---

// 1. Define el esquema para el CUERPO de la petición de login
const loginBodySchema = z.object({
    run: z.string({ required_error: 'El RUN es requerido' })
        .regex(/^[0-9]{7,8}$/, 'El RUN debe tener 7 u 8 dígitos sin puntos, guion ni dígito verificador'),
    password: z.string({ required_error: 'La contraseña es requerida' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// 2. Define el esquema COMPLETO para el middleware
const loginUserSchema = z.object({
    body: loginBodySchema,
});


module.exports = {
    registerUserSchema,
    loginUserSchema,
};
/**
 * Clase de error personalizada para manejar errores operativos de la aplicación
 * de una manera más estructurada y predecible.
 *
 * Un error "operativo" es un error esperado y manejable, como una entrada
 * de usuario incorrecta, un recurso no encontrado, o un fallo de autorización,
 * en contraposición a un error de programación (bug).
 */
class AppError extends Error {
    /**
     * Crea una instancia de AppError.
     * @param {string} message - El mensaje de error legible por humanos.
     * @param {number} statusCode - El código de estado HTTP que se debe enviar al cliente.
     */
    constructor(message, statusCode) {
        // Llama al constructor de la clase padre (Error) con el mensaje.
        // Esto establece la propiedad 'message' del error.
        super(message);

        // Propiedades personalizadas para nuestro AppError
        this.statusCode = statusCode;

        // Determina el 'status' ('fail' o 'error') basado en el statusCode.
        // Los códigos 4xx indican un fallo del cliente ('fail').
        // Los códigos 5xx indican un error del servidor ('error').
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Propiedad para distinguir los errores operativos (que confiamos y podemos mostrar al cliente)
        // de los errores de programación u otros errores desconocidos.
        this.isOperational = true;

        // Captura el stack trace (la pila de llamadas) para este error,
        // omitiendo la llamada al constructor de AppError de la pila.
        // Esto ayuda a que el stack trace apunte al lugar donde realmente se originó el AppError.
        // Esta característica es específica de V8 (motor de JavaScript de Node.js y Chrome).
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = { AppError };
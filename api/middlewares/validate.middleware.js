const { ZodError } = require('zod');

// Este middleware toma un esquema Zod y valida req.body, req.params o req.query
const validate = (schema) => async (req, res, next) => {
    try {

        // Zod parseará y validará. Si el esquema define transformaciones, se aplicarán.
        const parsed = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!parsed.success) {
            // Extraer errores de Zod de una manera amigable
            const errors = parsed.error.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message,
            }));
            return res.status(400).json({ status: 'fail', message: 'Validation errors', errors });
        }

        // Si la validación es exitosa, los datos parseados (y potencialmente transformados)
        // están en parsed.data. Los reasignamos a req.
        if (parsed.data.body) req.body = parsed.data.body;
        if (parsed.data.query) req.query = parsed.data.query;
        if (parsed.data.params) req.params = parsed.data.params;

        next(); // Pasa al siguiente middleware o al controlador
    } catch (error) {
        // Manejar otros errores inesperados durante la validación
        console.error("Unexpected error in validation middleware:", error);
        next(error); // Pasar al manejador de errores global
    }
};

module.exports = validate;
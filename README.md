# Proyecto con Prisma

Este proyecto utiliza Prisma como ORM para la gestión de base de datos.

## Requisitos

- Node.js instalado
- Base de datos configurada en el archivo `.env`
- Dependencias instaladas (`npm install`)

## Configuración inicial

1. Asegúrate de tener tu base de datos accesible y la cadena de conexión en `.env`:

   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_basedatos"


2. Ejecuta la siguiente migración para crear el esquema inicial:

npx prisma migrate dev --name inicial-auth-schema

Esto:

- Crea la tabla de migraciones.
- Ejecuta el SQL correspondiente a tu modelo en schema.prisma.
- Genera el cliente de Prisma automáticamente.

3. (Opcional) Verificar el estado de tu base de datos con:

npx prisma studio
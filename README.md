# Club Patin Web App

Este repositorio contiene una aplicación web para el Club de Patín Carrera. Incluye un backend con Express y MongoDB y un frontend con React y Vite.

## Estructura del proyecto

- `backend/` – Servidor Express con las rutas de autenticación y modelos de Mongoose.
- `club-patin/` – Aplicación React creada con Vite.

## Funcionalidades actuales

- Registro y login con email y contraseña.
- Registro e inicio de sesión con Google usando Passport.
- Verificación de correo electrónico mediante enlace enviado por email.
- Proteccion de rutas con JWT en el frontend.
- Subida de avatar opcional.

## Cómo ejecutar

1. Copia `.env.example` a `.env` y completa las variables necesarias (MongoDB, credenciales de Google, etc.).
2. Instala las dependencias en los dos proyectos:

```bash
cd backend && npm install
cd ../club-patin && npm install
```

3. Inicia el servidor backend:

```bash
cd backend
node index.js
```

4. En otra terminal, inicia el frontend:

```bash
cd club-patin
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` y el backend en `http://localhost:5000`.


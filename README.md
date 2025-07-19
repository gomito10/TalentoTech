# Proyecto TalentoTech (backend con Express y Firestore)
- Este proyecto es una API RestFull construida con **Node.js**, **Express** y **Firestore**, diseñada para manejar productos,usuarios y autenticación segura.
---
## ⚙️ Instalación
- Clonar el repositorio: bash git clone https://gomito10/TalentoTech.git.
- Instalar dependencias: npm install.
- Crear y configurar el archivo .env: FIREBASE_API_KEY=...
JWT_SECRET=...

---
## Scripts disponibles
- `npm run dev`: Inicia el servidor en modo desarrollo.
- `npm run start`: Inicia el servidor en modo producción.

---
## 📲 Funcionalidades
- CRUD completo de productos.
- Busqueda por letra inicial en el título.
- Orden dinámico por precio o título.
- Filtrado por categorías y rangos.
- Autenticación con JWT.
- Cifrado de contraseñas con bcrypt.
- Middleware para rutas protegidas.

---
## Endpoints principales
### productos
- GET /products - Listar todos los productos.
- GET /profuct/:id - Obtener un producto por ID.
- POST /addProduct - Crear un nuevo producto (requiere Token).
- PATCH /updateProduct/:id - Actualizar un producto existente (requiere Token).
- DELETE /delete/:id - Eliminar un producto (requiere Token).
- GET /category/:category - Listar productos por categoría.
- GET /filter/:category/?minPrice=30000&maxPrice=70000&sortDirection=asc - Aplicar filtros dinámicos.
- GET /search/?letter=r&asc - Buscar producto por primera letra y ordenar por precio.

### usuarios
- POST /register - Registrar un nuevo usuario.
- POST /login - Iniciar sesión.
- GET /getUsers - Listar todos los usuarios (requiere Token y ser admin).
- GET /getUser/:id - Obtemer un usuarion por ID (requiere Token y ser admin).
- PATCH /updateUser/:id - Actualizardatos de usuario (requiere Token y ser admin).
- DELETE /deleteUser/:id - Eliminar usuario (requiere Token y ser admin).

### Usuario base para login
username:LuisAlberto7
password:Gomito10
---
## 🛠️ Tecnologías usadas
- Node.js.
- Express.js.
- Firebase Firestore.
- JWT (Autenticación).
- Bcrypt (seguridad).
- Dotenv (entorno).
- Express-validator (validación).
- Swagger
---
## Enlaces
- Github: [Repositorio TalentoTech](https://github.com/gomito10/TalentoTech)
- Vercel: https://tu-app.vercel.app
---
## Documentación Swagger
La API cuenta con documentación interactiva accesible en : http://localhost:5000/api-docs
Incluye esquemas, rutas protegidas, validación de parámetros y pruebas en vivo.
---
## Autor
**Luis Alberto Gómez**
Desarrollador backend especial8zado en Express,Firestore y documentación Swagger.


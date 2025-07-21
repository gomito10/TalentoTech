# Proyecto TalentoTech (backend con Express y Firestore)
- Este proyecto es una API RestFull construida con **Node.js**, **Express** y **Firestore**, diseñada para manejar productos,usuarios y autenticación segura.

---

## ⚙️ Instalación
- Clonar el repositorio: 
```bash 
git clone https://github.com/gomito10/TalentoTech.git
```
- Instalar dependencias: npm install.
- Crear y configurar el archivo .env: FIREBASE_API_KEY=...
JWT_SECRET=...

---
## Scripts disponibles
- **Inicia el servidor en modo desarrollo:**
```bash
npm run dev
```
- **Inicia el servidor en modo producción:**
```bash
npm run start
```

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
-Todas las rutas están organizadas con los siguientes prefijos:

- 🛒 `/api` → para operaciones con productos
- 👤 `/auth` → para usuarios y autenticación

> Todas las rutas están bajo el prefijo `/api`. Las rutas marcadas como protegidas requieren token JWT en el header: `Authorization: Bearer <token>`

---

### 🔍 **Listar todos los productos**  
- **Método:** `GET /products`  
- **Parámetros:** ninguno.  
- **Ejemplo de uso:** `/api/products`  
- **Ejemplo de respuesta:**
```json
[
  {
    "id": 1,
    "title": "remera",
    "price": 23000,
    "category": "indumentaria",
    "description":"remera de algodón"
  }
]
```

---

### 📦 **Obtener un producto por ID**  
- **Método:** `GET /product/:id`  
- **Parámetros:**  
  - `id` (path, requerido): ID del producto.  
- **Ejemplo de uso:** `/api/product/1`  
- **Ejemplo de respuesta:**
```json
{
  "id": "1",
  "title": "remera",
  "category": "indumentaria",
  "price": 23000,
  "description":"remera de algodón"
}
```

---

### 🛠️ **Crear un nuevo producto** *(requiere token)*  
- **Método:** `POST /addProduct`  
- **Parámetros:** en el cuerpo.  
- **Ejemplo de uso:** `/api/addProduct`
- **Body (JSON)**:
```json
{
  "title": "Celular",
  "price": 300000,
  "category": "tecnología",
  "description": "celular samsung A05"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Producto creado correctamente",
  "product": {
    "id": "2",
    "title": "Celukar",
    "price": 300000,
    "category": "tecnología",
    "description":"celular samsung A05"
  }
}
```

---

### 🔄 **Actualizar producto existente** *(requiere token)*  
- **Método:** `PATCH /updateProduct/:id`  
- **Parámetros:**  
  - `id` (path, requerido): ID del producto.  
- **Ejemplo de uso:** `/api/updateProduct/2`
- **Error:**
- Sólo puede actualizarse el campo precio,de lo contrario lanzará un error de estado 400
- **Body (JSON)**:
```json
{
  "price": 33000
}
```
- **Ejemplo de respuesta:**
```json
{
"message": "producto actualizado correctamente",
  "id": "2",
  "title": "campera"
  "category": "indumentaria",
  "description": "ropa de invierno",
  "price": "33000",
  "creatAt": "2025-07-16T00:57:30.597Z"
}
```

---

### 🗑️ **Eliminar producto** *(requiere token)*  
- **Método:** `DELETE /delete/:id`  
- **Parámetros:**  
  - `id` (path, requerido): ID del producto.  
- **Ejemplo de uso:** `/api/delete/3`  
- **Ejemplo de respuesta:**
```json
{
  "message": "producto eliminado correctamente",
  "id": "3",
  "title": "campera",
  "category": "indumentaria"
  "description": "ropa de invierno",
  "price": "55000",
  "creatAt": "2025-07-16T01:35:53.345Z",
}
```

---

### 🧩 **Listar productos por categoría**  
- **Método:** `GET /category/:category`  
- **Parámetros:**  
  - `category` (path, requerido): nombre de categoría.  
- **Ejemplo de uso:** `/api/category/indumentaria`  
- **Ejemplo de respuesta:**
```json
[
  {
    "id": "2",
    "title": "remera",
    "category": "indumentaria",
    "description": "remera de algodón"
    "price": "23000",
    "creatAt": "2025-07-17T17:41:23.172Z",
  },
  {
    "id": "3",
    "title": "campera",
    "category": "indumentaria"
    "description": "ropa de invierno",
    "price": "55000",
    "creatAt": "2025-07-16T01:35:53.345Z"
  }
]
```

---

### 🎛️ **Aplicar filtros dinámicos**  
- **Método:** `GET /filter/:category`  
- **Parámetros:**  
  - `category` (path, requerido).  
  - `min`, `max`, `sortDirection (asc o desc)` (query).  
- **Ejemplo de uso:** `/api/filter/pantallas?min=30000&max=70000&sortDirection=asc`  
- **Ejemplo de respuesta:**
```json
[
  {
    "id": "7",
    "title": "Monitor 24 pulgadas",
    "price": 54000,
    "category": "pantallas"
  }
]
```

---

### 🔠 **Buscar por letra inicial y ordenar por precio**  
- **Método:** `GET /search`  
- **Parámetros:**  
  - `letter` (query): letra inicial.  
  - `sortDirection` (query opcional): orden ascendente `(asc)` y orden descendente `(desc)`.  
- **Ejemplo de uso:** `/api/search?letter=r&sortDirection=asc`
- El orden es por precio
- **Ejemplo de respuesta:**
```json
[
  {
    "id": "2",
    "title": "remera",
    "category": "indumentaria",
    "description": "remera de algodón"
    "price": "23000",
    "creatAt": "2025-07-17T17:41:23.172Z",
  },
  {
    "id": "3",
    "title": "campera",
    "category": "indumentaria"
    "description": "ropa de invierno",
    "price": "55000",
    "creatAt": "2025-07-16T01:35:53.345Z"
  }
]
```
## 👤 Endpoints de Usuarios y Autenticación (`/auth`)

> Todas las rutas están bajo el prefijo `/auth`. Las protegidas requieren token JWT: `Authorization: Bearer <token>`.  
> Las rutas que leen, actualizan o eliminan usuarios requieren **rol admin**.

---

### 📝 **Registrar nuevo usuario**  
- **Método:** `POST /register`  
- **Parámetros:** en el cuerpo (nombre, email, contraseña, etc.)  
- **Ejemplo de uso:** `/auth/register`
- **Body (JSON)**:
```json

{
 "username":"LuisAlberto7",
 "email":"luis@example.com",
 "password":"******",
 "confirmPassword":"******",
 "role":"user"
}
```

- **Ejemplo de respuesta:**
```json
{
  "message": "Usuario registrado correctamente",
  "user":{
  "id": "1",
  "username": "LuisAlberto7",
  "email": "luis@example.com",
  "role":"user"
  }
```

---

### 🔐 **Iniciar sesión**  
- **Método:** `POST /login`  
- **Parámetros:** en el cuerpo (`username` y `password`)  
- **Ejemplo de uso:** `/auth/login` 
- **Usuario base para login**
- **Body(JSON):**
```json
{
 "username":"LuisAlberto7"
 "password":"Gomito10"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "hash del token generado"
}
```

---

### 👥 **Listar todos los usuarios** *(admin, requiere token)*  
- **Método:** `GET /getUsers`  
- **Parámetros:** ninguno.  
- **Ejemplo de uso:** `/auth/getUsers`  
- **Ejemplo de respuesta:**
```json
[
{
    "id": 1,
    "username": "Mariela37",
    "email": "gomito724@gmail.com",
    "role": "user",
    "password": "$2b$10$3rBWHHa4KFxwkFopMYZD7euxzIezUO.BsWY9TX6VqWTKO5g7aKlJ2",
    "createAt": "2025-07-21T11:50:22.811Z",
  },
  {
    "id": "2",
    "username": "Mariela000",
    "email": "mariela@example.com",
    "role": "user",
    "password": "$2b$10$DtcE6ehyrCC7LIigxNL/7ubrR.F5kWG9QV.AxEwW/TnsahSS4FpZq",
    "createAt": "2025-07-21T12:04:04.710Z"
  },
]
```

---

### 🔍 **Obtener usuario por ID** *(admin, requiere token)*  
- **Método:** `GET /getUser/:id`  
- **Parámetros:**  
  - `id` (path, requerido): ID del usuario.  
- **Ejemplo de uso:** `/auth/getUser/1`  
- **Ejemplo de respuesta:**
```json
{
  "id": "1",
  "username": "LuisAlberto7",
  "email": "luis@example.com",
  "role": "admin"
}
```

---

### 🛠️ **Actualizar datos de usuario** *(admin, requiere token)*  
- **Método:** `PATCH /updateUser/:id`  
- **Parámetros:**  
  - `id` (path, requerido): ID del usuario.  
  - cuerpo con campos modificables.  
- **Ejemplo de uso:** `/auth/updateUser/1`
- **Body (JSON):**
```json
{
  "username":"luisAlberto7"
}
```
- **Ejemplo de respuesta:**
```json
{
  "message": "El usuario se ha actualizado correctamente",
  "id": "OxLKkamuP2jC6mPc0nRR",
  "username": "luisAlberto7",
  "email": "gomito724@gmail.com",
  "password": "$2b$10$3rBWHHa4KFxwkFopMYZD7euxzIezUO.BsWY9TX6VqWTKO5g7aKlJ2",
  "role": "user"
  "createAt": "2025-07-21T11:50:22.811Z",
}
```

---

### 🗑️ **Eliminar usuario** *(admin, requiere token)*  
- **Método:** `DELETE /deleteUser/:id`  
- **Parámetros:**  
  - `id` (path, requerido): ID del usuario.  
- **Ejemplo de uso:** `/auth/deleteUser/1`  
- **Ejemplo de respuesta:**
```json
{
  "message": "Usuario eliminado correctamente",
  "id": "OxLKkamuP2jC6mPc0nRR",
  "username": "Gomito2019",
  "email": "gomito724@gmail.com",
  "password": "$2b$10$3rBWHHa4KFxwkFopMYZD7euxzIezUO.BsWY9TX6VqWTKO5g7aKlJ2",
  "role": "user"
  "createAt": "2025-07-21T11:50:22.811Z",
}
```

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

## Estructura del proyecto
```
.
├── README.md
├── estructura.txt
├── index.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   ├── imaages
│   └── notFound.html
├── src
│   ├── controllers
│   ├── data
│   ├── middlewares
│   ├── models
│   ├── routes
│   └── utils
├── swagger.js
└── vercel.json

11 directories, 8 files

```
## Enlaces
- ## 🚀 Acceso al Proyecto

- 📦 Repositorio: [TalentoTech en GitHub](https://github.com/gomito10/TalentoTech)
- 🌐 Deploy: [TalentoTech en Vercel](https://talento-tech-iota.vercel.app)

---

## 📘 Documentación Swagger

- La API cuenta con documentación interactiva accesible en:

🔗 [https://talento-tech-iota.vercel.app/api-docs](https://talento-tech-iota.vercel.app/api-docs)

- Incluye esquemas, rutas protegidas, validación de parámetros y pruebas en vivo.
---

## Autor
**Luis Alberto Gómez**
- Desarrollador backend especial8zado en Express,Firestore y documentación Swagger.


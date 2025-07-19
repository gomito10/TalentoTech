import { Router } from "express";
import {
  register,
  login,
  getUsersController,
  getUserController,
  update,
  removeUser,
} from "../controllers/users.controllers.js";
import { verifyToken } from "../middlewares/middlewares.js";

const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Campos faltantes o formato incorrecto"
 *               statusCode: 400
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error al registrar usuario"
 *               statusCode: 500
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Email o contraseña faltante"
 *               statusCode: 400
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Credenciales inválidas"
 *               statusCode: 401
 *       500:
 *         description: Error interno al iniciar sesión
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error inesperado en login"
 *               statusCode: 500
 */
router.post("/login", login);

/**
 * @swagger
 * /getUsers:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       401:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token requerido"
 *               statusCode: 401
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Solo administradores pueden acceder"
 *               statusCode: 403
 *       500:
 *         description: Error interno al obtener usuarios
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error inesperado"
 *               statusCode: 500
 */
router.get("/getUsers", verifyToken, getUsersController);

/**
 * @swagger
 * /getUser/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token no válido"
 *               statusCode: 401
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "No tenés permisos para esta operación"
 *               statusCode: 403
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Usuario con ID no existente"
 *               statusCode: 404
 *       500:
 *         description: Error interno al obtener usuario
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error inesperado"
 *               statusCode: 500
 */
router.get("/getUser/:id", verifyToken, getUserController);

/**
 * @swagger
 * /updateUser/{id}:
 *   patch:
 *     summary: Actualizar usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Formato de datos incorrecto"
 *               statusCode: 400
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token no válido"
 *               statusCode: 401
 *       403:
 *         description: Usuario no autorizado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "No tenés permisos para actualizar"
 *               statusCode: 403
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Usuario con ID no existe"
 *               statusCode: 404
 *       500:
 *         description: Error interno al actualizar usuario
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error inesperado"
 *               statusCode: 500
 */
router.patch("/updateUser/:id", verifyToken, update);

/**
 * @swagger
 * /deleteUser/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: Token faltante o inválido
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token no válido"
 *               statusCode: 401
 *       403:
 *         description: Acceso denegado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Permisos insuficientes"
 *               statusCode: 403
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "No existe el usuario con ese ID"
 *               statusCode: 404
 *       500:
 *         description: Error interno al eliminar usuario
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error inesperado en el servidor"
 *               statusCode: 500
 */
router.delete("/deleteUser/:id", verifyToken, removeUser);

export default router;
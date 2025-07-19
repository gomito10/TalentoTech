import express from "express";
import {
  getProductsController,
  getProductByIdController,
  addProductController,
  updateProductController,
  getCategoryController,
  filterController,
  deleteDocument,
  getProductByTitle,
} from "../controllers/products.controllers.js";
import { verifyToken } from "../middlewares/middlewares.js";

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Producto"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error al obtener productos"
 *               statusCode: 500
 */
router.get("/products", getProductsController);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Producto"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Producto con ID no existente"
 *               statusCode: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error interno del servidor"
 *               statusCode: 500
 */
router.get("/product/:id", getProductByIdController);

/**
 * @swagger
 * /addProduct:
 *   post:
 *     summary: Agregar un nuevo producto
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Producto"
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Campos obligatorios faltantes o incorrectos"
 *               statusCode: 400
 *       401:
 *         description: Token faltante o inválido o vencido
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token no proporcionado,incorrecto o caducado"
 *               statusCode: 401
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error al guardar producto"
 *               statusCode: 500
 */
router.post("/addProduct", verifyToken, addProductController);

/**
 * @swagger
 * /updateProduct/{id}:
 *   patch:
 *     summary: Actualizar campos de un producto
 *     tags:
 *       - Productos
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
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Campos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Datos incompletos o incorrectos"
 *               statusCode: 400
 *       401:
 *         description: Token faltante o inválido
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token inválido"
 *               statusCode: 401
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Producto con ID no existente"
 *               statusCode: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error al actualizar producto"
 *               statusCode: 500
 */
router.patch("/updateProduct/:id", verifyToken, updateProductController);

/**
 * @swagger
 * /category/{category}:
 *   get:
 *     summary: Obtener productos por categoría
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       404:
 *         description: Categoría no encontradoa
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "La categoría no 3xiste"
 *               statusCode: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error al filtrar por categoría"
 *               statusCode: 500
 */
router.get("/category/:category", getCategoryController);

/**
 * @swagger
 * /filter/{category}:
 *   get:
 *     summary: Filtrar productos por categoría ordenando por precio
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: min
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 1000
 *       - name: max
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 50000
 *       - name: sortDirection
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Productos filtrados
 *       400:
 *         description: Datos incorrectos
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "cadena de consulta mal formateada"
 *               statusCode: 400
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "No se encontraron productos"
 *               statusCode: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error al filtrar productos"
 *               statusCode: 500
 */
router.get("/filter/:category", filterController);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Eliminar producto por ID
 *     tags:
 *       - Productos
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
 *         description: Producto eliminado
 *       401:
 *         description: Token faltante o inválido
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Token requerido"
 *               statusCode: 401
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Producto no existente"
 *               statusCode: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error del servidor al eliminar producto"
 *               statusCode: 500
 */
router.delete("/delete/:id", verifyToken, deleteDocument);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Buscar producto por título
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: letter
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: p
 *       - name: sortDirection
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       404:
 *         description: No se encontraron productos con ese título
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "No se encontraron coincidencias"
 *               statusCode: 404
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Error del servidor al buscar productos"
 *               statusCode: 500
 */
router.get("/search", getProductByTitle);

export default router;
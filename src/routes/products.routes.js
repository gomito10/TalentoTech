import express from "express";
import {Router} from "express";
import {getProductsController,getProductByIdController,addProductController,updateProductController,getCategoryController,filterController,deleteDocument,getProductByTitle} from "../controllers/products.controllers.js";
import {verifyToken} from "../middlewares/middlewares.js";
const router=Router();

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
 *       404:
 *         description: Producto no encontrado
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
 *     responses:
 *       200:
 *         description: Productos filtrados
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
 *       404:
 *         description: Producto no encontrado
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
 *       - name: title
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto(s) encontrados
 *       404:
 *         description: No se encontraron productos
 */
router.get("/search", getProductByTitle);

export default router;
import express from "express";
import {Router} from "express";
import {getProductsController,getProductByIdController,addProductController,updateProductController,getCategoryController,filterController,deleteDocument,getProductByTitle} from "../controllers/products.controllers.js"
import {register,login,getUsersController,getUserController,update,removeUser} from "../controllers/users.controllers.js";
import {verifyToken} from "../middlewares/middlewares.js";
const router=Router();

//rutas de productos
router.get("/products",getProductsController);//obtener todos los productos
router.get("/product/:id",getProductByIdController)//obtener un producto por id
router.post("/addProduct",verifyToken,addProductController);
router.patch("/updateProduct/:id",verifyToken,updateProductController);
router.get("/category/:category",getCategoryController);
router.get("/filter/:category",filterController);
router.delete("/delete/:id",verifyToken,deleteDocument);
router.get("/search",getProductByTitle);
//rutas de usuarios
router.post("/register",register);
router.post("/login",login)
router.get("/getUsers",verifyToken,getUsersController);
router.get("/getUser/:id",verifyToken,getUserController);
router.patch("/updateUser/:id",verifyToken,update);
router.delete("/deleteUser/:id",verifyToken,removeUser);
export default router;
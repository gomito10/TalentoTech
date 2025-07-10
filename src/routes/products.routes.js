import express from "express";
import {Router} from "express";
import {getProductsController,getProductByIdController,addProductController,updateProductController,getCategoryController,filterController,deleteDocument} from "../controllers/products.controllers.js"
import {register,login} from "../controllers/users.controllers.js";
import {verifyToken} from "../middlewares/products.middlewares.js";
const router=Router();

router.get("/products",getProductsController);
router.get("/product/:id",getProductByIdController)
router.post("/addProduct",verifyToken,addProductController);
router.patch("/updateProduct/:id",verifyToken,updateProductController);
router.get("/category/:category",getCategoryController);
router.get("/filter/:category",filterController);
router.delete("/delete/:id",verifyToken,deleteDocument);
router.post("/register",register);
router.post("/login",login)
export default router;
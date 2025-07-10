import {getProducts,getProductById,addProduct,updateProduct,getProductCategory,filterProducts,deleteProduct} from "../models/products.models.js";
export const getProductsController=async(req,res,next)=>{
  try{
    const products=await getProducts();
    res.json(products);
  }catch(error){
    next(error)
  }
}
export const getProductByIdController=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const product=await getProductById(id);
    res.json(product)
  }catch(error){
    next(error)
  }
}
export const addProductController=async(req,res,next)=>{
  try{
    const product=await addProduct(req.body);
    res.json(product)
  }catch(error){
    next(error)
  }
}

export const updateProductController=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const cambios=req.body;
    const product=await updateProduct(id,cambios)
    res.status(201).json(product);
  }catch(error){
    next(error)
  }
}
export const getCategoryController=async(req,res,next)=>{
  try{
    const {category}=req.params;
    const products=await getProductCategory(category);
    res.json(products)
  }catch(error){
    next(error)
  }
}
export const filterController=async(req,res,next)=>{
  try{
    const {category}=req.params;
    const {
      sortDirection,
      max,
      min
    }=req.query;
    const filtros={
      category:category,
      sortDirection:sortDirection || "asc",
      maxPrice: max !== undefined ? parseFloat(max) : Infinity,
      minPrice: min !== undefined ? parseFloat(min) : 0
    }
    const productos=await filterProducts(filtros);
    res.status(201).json(productos)
  }catch(error){
    next(error);
  }
}
export const deleteDocument=async(req,res,next)=>{
  try{
    const {id}=req.params;
    const product=await deleteProduct(id);
    res.status(201).json(product)
  }catch(error){
    next(error)
  }
}
import {db} from "../data/data.js";
import {
  collection,getDoc,getDocs,doc,addDoc,deleteDoc,updateDoc,query,where,orderBy,startAt,endAt
} from "firebase/firestore";

const productionCollection=collection(db,"Products");
export const getProducts=async()=>{
  try{
  const documentos=await getDocs(productionCollection);
  const products=documentos.docs.map((doc)=>({id:doc.id,...doc.data()}))
  return products;
  }catch(error){
    const errors= new Error("Error en el servidor al obtener productos");
    errors.statusCode= 500;
    throw errors;
  }
}
export const getProductById=async (id)=>{
  const docRef=doc(productionCollection,id);
  const product=await getDoc(docRef);
  if(!product.exists()){
    const error= new Error("El producto no existe");
    error.statusCode= 404;
    throw error;
  }
  return {id:docRef.id,...product.data()}
}
export const addProduct=async(product)=>{
  try{
  const {title,price,category,description}=product;
  const saveProduct={
    title,
    price,
    category,
    description,
    creatAt:new Date().toISOString()
  }
  if(!title  || !price || !category || !description){
    const error= new Error("Debe comoletar todos los campos");
    error.statusCode= 400;
    throw error;
  }
  const docRef=await addDoc(productionCollection,saveProduct);
  return `producto ${docRef.id} agregado correctamente`
  }catch(error){
    const errors= new Error("Formato inválido");
    errors.statusCode= 400;
    throw error;
  }
}
export const deleteProduct=async(id)=>{
  const docRef=doc(productionCollection,id);
  const product=await getDoc(docRef)
  if(!product.exists()){
    const error= new Error("El producto no existe");
    error.statusCode= 404;
    throw error;
  }
  await deleteDoc(docRef);
  return {message:"producto eliminado correctamente",id:product.id,...product.data()}
}
export const updateProduct=async(id,body)=>{
  const keys=Object.keys(body);
const docRef=doc(productionCollection,id);
  const product=await getDoc(docRef);
  if(!product.exists()){
    const error= new Error("El producto no existe");
    error.statusCode= 404;
    throw error;
  }
  if(keys[0] !== "price" || keys.length > 1){
    const error= new Error("Sólo puede actualizarce el campo precio");
    error.statusCode= 400;
    throw error;
  }
  const {price}=body;
  if(product.data().price === body.price){
    const error= new Error("El valor ingresado debe ser diferente al anterior");
    error.statusCode= 400;
    throw error
  }
  await updateDoc(docRef,{price});
  const update=await getDoc(docRef);
  return {message:"producto actualizado correctamente",id:docRef.id,...product.data(),...update.data()};
}
export const getProductCategory=async(category)=>{
  const docRef=query(productionCollection,where("category","==",category));
  const documents=await getDocs(docRef)
  if(documents.empty){
    const error= new Error("La categoria no existe");
    error.statusCode= 404;
    throw error;
  }
 const productsCategory=await getDocs(docRef)
  const products=productsCategory.docs.map((doc)=>({
    id:doc.id,
    ...doc.data()
  }))
  return products;
}
export const filterProducts=async({category,sortDirection,minPrice,maxPrice})=>{
  const q=query(productionCollection,
  where("price",">=",minPrice),
  where("price","<=",maxPrice),
  where("category","==",category),
  orderBy("price",sortDirection)
    );
    if (minPrice < 0){
      const error= new Error("El precio mínimo debe ser mayor a 0");
      error.statusCode= 400;
      throw error;
    }
    const products=await getDocs(q);
    if(products.empty){
      const error= new Error("La categoria no existe");
      error.statusCode= 404;
      throw error;
    }
    const filtro=products.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))
    return filtro;
}
export const searchProducts=async({sortDirection,letter})=>{
  let snapDocument;
  
  if(!letter){
    snapDocument= await getDocs(productionCollection)
  }else{
    const q=query(productionCollection,
    orderBy("title"),
    startAt(letter),
    endAt(letter + "\uf8ff")
  );
  snapDocument= await getDocs(q)
  }
  if(snapDocument.empty){
    const error= new Error("No hay productos con ese titulo");
    error.statusCode= 404;
    throw error;
  }
  const listProducts=snapDocument.docs.map((doc)=>({
    id:doc.id,...doc.data()
  }))
  const ordered=listProducts.sort((a,b)=>sortDirection === "asc" ? a.price-b.price : b.price-a.price)
  return ordered;
}
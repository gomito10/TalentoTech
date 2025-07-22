import {db} from "../data/data.js";
import {
  collection,getDoc,getDocs,doc,addDoc,deleteDoc,updateDoc,query,where,orderBy,startAt,endAt
} from "firebase/firestore";

const productionCollection=collection(db,"Products");

//Obtener todos los productos
export const getProducts = async () => {
  const snapshot = await getDocs(productionCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
//Obtener un producto especifico
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
//Agregar un nuevo producto
export const addProduct = async (product) => {
  const { title, price, category, description } = product;

  if (!title || !price || !category || !description) {
    const error = new Error("Debe completar todos los campos");
    error.statusCode = 400;
    throw error;
  }

  const saveProduct = {
    title,
    price,
    category,
    description,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(productionCollection, saveProduct);
  return `Producto '${saveProduct.title}' agregado correctamente`;
};
//Eliminar un producto
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
//Actualizar un producto
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
//Obtener productos de una determinada categoría
export const getProductCategory=async(category)=>{
  const docRef=query(productionCollection,where("category","==",category));
  const documents=await getDocs(docRef)
  if(documents.empty){
    const error= new Error("La categoria no existe");
    error.statusCode= 404;
    throw error;
  }
 
  const products=documents.docs.map((doc)=>({
    id:doc.id,
    ...doc.data()
  }))
  return products;
}
//Ordenar por precio los productos de una determinada categoría 
export const filterProducts = async ({ category, sortDirection, minPrice, maxPrice }) => {
  if (minPrice < 0) {
    const error = new Error("El precio mínimo debe ser mayor a 0");
    error.statusCode = 400;
    throw error;
  }

  const q = query(
    productionCollection,
    where("price", ">=", minPrice),
    where("price", "<=", maxPrice),
    where("category", "==", category),
    orderBy("price", sortDirection)
  );

  const products = await getDocs(q);

  if (products.empty) {
    const error = new Error("No se encontraron productos en esa categoría con ese rango de precios");
    error.statusCode = 404;
    throw error;
  }

  const minimos = products.docs.some((item) => {
    const data = item.data();
    return Number(data.price) >= Number(minPrice);
  });

  if (!minimos) {
    const error = new Error("No hay productos que cumplan con el precio mínimo solicitado");
    error.statusCode = 404;
    throw error;
  }

  const filtro = products.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  return filtro;
};
//Buscar productos por comienzo de letra
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
  const ordered=listProducts.sort((a,b)=>sortDirection === "asc" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price))
  return ordered;
}
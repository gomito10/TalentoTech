import {db} from "../data/data.js";
import {
  collection,getDoc,getDocs,doc,addDoc,deleteDoc,updateDoc,query,where,orderBy,startAt,endAt
} from "firebase/firestore";

const productionCollection=collection(db,"Products");
export const getProducts=async()=>{
  const documentos=await getDocs(productionCollection);
  const products=documentos.docs.map((doc)=>({id:doc.id,...doc.data()}))
  return products;
}
export const getProductById=async (id)=>{
  const docRef=doc(productionCollection,id);
  const product=await getDoc(docRef);
  if(!product.exists()){
    throw new Error("El producto no existe")
  }
  return {id:product.id,...product.data()}
}
export const addProduct=async(product)=>{
  const {title,price,category,description}=product;
  const saveProduct={
    title,
    price,
    category,
    description,
    creatAt:new Date().toISOString()
  }
  const docRef=await addDoc(productionCollection,saveProduct);
  return `producto ${docRef.id} agregado correctamente`
}
export const deleteProduct=async(id)=>{
  const docRef=doc(productionCollection,id);
  const product=await getDoc(docRef)
  if(!product.exists()){
    throw new Error("El producto no existe")
  }
  await deleteDoc(docRef);
  return {message:"producto eliminado correctamente",id:product.id,...product.data()}
}
export const updateProduct=async(id,cambios)=>{
  
const docRef=doc(productionCollection,id);
  const product=await getDoc(docRef);
  if(!product.exists()){
    throw new Error("El producto no existe")
  }
  await updateDoc(docRef,cambios)
  return {message:"producto actualizado correctamente",id:docRef.id,...product.data(),...cambios}
}
export const getProductCategory=async(category)=>{
  const docRef=query(productionCollection,where("category","==",category));
  const documents=await getDocs(docRef)
  if(documents.empty){
    throw new Error("La categoria no existe")
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
    const products=await getDocs(q);
    const filtro=products.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))
    return filtro;
}
export const searchProducts=async({sortDirection,letter})=>{
  const q=query(productionCollection,
    orderBy("title"),
    startAt(letter),
    endAt(letter + "\uf8ff")
  );
  const products=await getDocs(q)
  if(products.empty){
    throw new Error("No hay productos con ese titulo")
  }
  const listProducts=products.docs.map((doc)=>({
    id:doc.id,...doc.data()
  }))
  const ordered=listProducts.sort((a,b)=>sortDirection === "asc" ? a.price-b.price : b.price-a.price)
  return ordered;
}
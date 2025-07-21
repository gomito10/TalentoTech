import {db} from "../data/data.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import {generateToken} from "../utils/token-generator.js";
import "dotenv/config"
import {
  collection,getDoc,getDocs,doc,addDoc,deleteDoc,updateDoc,query,where,orderBy
} from "firebase/firestore";

const userCollection=collection(db,"Users");
const adminCollection=collection(db,"Admins");
export const registerUser=async({username,password,confirmPassword,email,role})=>{
  const saltRound=10;
  const hashedPassword=await bcrypt.hash(password,saltRound);
  const saveUser={
    username,
    password:hashedPassword,
    email,
    role:role,
    createAt:new Date().toISOString()
  }
  const roleCollection={
    user:userCollection,
    admin:adminCollection
  };
const q=query(userCollection,where("username","==",username));
  const getUser=await getDocs(q);
  if(!getUser.empty){
    const error= new Error("El usuario ya existe");
    error.statusCode= 400;
    throw error;
  }
  if(!Object.keys(roleCollection).includes(saveUser.role)){
    const error= new Error(`rol inválido: ${saveUser.role} no está permitido`);
    error.statusCode= 400;
    throw error;
  }
  const docRef=await addDoc(roleCollection[saveUser.role],saveUser)
  return {message:"Usuario registrado correctamente",user:{"id":docRef.id,"username":saveUser.username,"email":saveUser.email,"role":saveUser.role}}
}
export const loginUser=async(username,password)=>{
  const q=query(userCollection,where("username","==",username));
  const user=await getDocs(q);
  if(user.empty){
    const error= new Error("Usuario incorrecto");
    error.statusCode= 400;
    throw error;
  }
  const userDoc=user.docs[0];
  const userData=userDoc.data();
  const passwordMatch=await bcrypt.compare(password,userData.password);
  if(!passwordMatch){
    const error= new Error("Contraseña incorrecta");
    error.statusCode= 400;
    throw error;
  }
  const payload={
    uid:userData.id,
    username:userData.username,
    role:userData.role
  }
  const token=generateToken(payload)
  return {success:"login exitoso",token}
}
export const getUsers=async()=>{
  try{
    const getDocuments=await getDocs(userCollection);
    const users=getDocuments.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }));
    return users;
  }catch(error){
    throw new Error("Error al obtener usuarios");
  }
}
export const getUser=async(id)=>{
  const docRef=doc(userCollection,id);
  const user=await getDoc(docRef);
  if(!user.exists()){
    const error= new Error("El usuario no existe");
    error.statusCode= 404;
    throw error;
  }
  return {id:user.id,...user.data()}
}
export const updateUser=async(id,cambios)=>{
  const docRef=doc(userCollection,id);
  const user=await getDoc(docRef);
  const q=query(userCollection,where("username","==",cambios.username));
  const document=await getDocs(q);
  if(!user.exists()){
    const error= new Error("El usuario no existe");
    error.statusCode= 404;
    throw error;
  }
  if(!document.empty){
    const error= new Error("El usuario ya está en uso");
    error.statusCode= 400;
    throw error;
  }
  await updateDoc(docRef,cambios);
  return {message:"El usuario se ha actualizado correctamente",id:user.id,...user.data(),...cambios}
}
export const deleteUser=async(id)=>{
  const docRef=doc(userCollection,id);
  const user=await getDoc(docRef);
  if(!user.exists()){
    const error= new Error("El usuario no existe");
    error.statusCode= 404;
    throw error;
  }
  await deleteDoc(docRef);
  return {message:"Usuario elinado correctamente",id:user.id,...user.data()}

}

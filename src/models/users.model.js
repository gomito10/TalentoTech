import {db} from "../data/data.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config"
import {
  collection,getDoc,getDocs,doc,addDoc,deleteDoc,updateDoc,query,where,orderBy
} from "firebase/firestore";

const userCollection=collection(db,"Users");
const JWT_SECRET=process.env.JWT_SECRET;

export const registerUser=async({username,password,confirmPassword,email,admin})=>{
  const saltRound=10;
  const hashedPassword=await bcrypt.hash(password,saltRound);
  const saveUser={
    username,
    password:hashedPassword,
    email,
    admin:admin || false,
    createAt:new Date().toISOString()
  }
  const q=query(userCollection,where("username","==",username));
  const getUser=await getDocs(q);
  if(!getUser.empty){
    throw new Error("El usuario ya existe")
  }
  await addDoc(userCollection,saveUser)
  return {message:"Usuario registrado correctamente"}
}
export const loginUser=async(username,password)=>{
  const q=query(userCollection,where("username","==",username));
  const user=await getDocs(q);
  if(user.empty){
    throw new Error("Usuario o Contraseña incorrecta ")
  }
  const userDoc=user.docs[0];
  const userData=userDoc.data();
  const passwordMatch=await bcrypt.compare(password,userData.password);
  if(!passwordMatch){
    throw new Error("Usuario o Contraseña incorrecta")
  }
  const payload={
    uid:userDoc.id,
    username:userData.username,
    admin:userData.admin
  }
  const token=jsonwebtoken.sign(payload,JWT_SECRET,{expiresIn:"1h"})
  return {success:"login exitoso",token}
}
export const getUsers=async()=>{
    const getDocuments=await getDocs(userCollection);
    const users=getDocuments.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }));
    return users;
}
export const getUser=async(id)=>{
  const docRef=doc(userCollection,id);
  const user=await getDoc(docRef);
  if(!user.exists()){
    throw new Error("El usuario no existe")
  }
  return {id:user.id,...user.data()}
}
export const updateUser=async(id,cambios)=>{
  const docRef=doc(userCollection,id);
  const user=await getDoc(docRef);
  const q=query(userCollection,where("username","==",cambios.username));
  const document=await getDocs(q);
  if(!user.exists){
    throw new Error("El usuario no existe")
  }
  if(!document.empty){
    throw new Error("El usuario ya está en uso")
  }
  await updateDoc(docRef,cambios);
  return {message:"El usuario se ha actualizado correctamente",id:user.id,...user.data(),...cambios}
}
export const deleteUser=async(id)=>{
  const docRef=doc(userCollection,id);
  const user=await getDoc(docRef);
  if(!user.exists()){
    throw new Error("El usuario no existe")
  }
  await deleteDoc(docRef);
  return {message:"Usuario elinado correctamente",id:user.id,...user.data()}

}

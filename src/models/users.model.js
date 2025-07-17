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
    role:role || "user",
    createAt:new Date().toISOString()
  }
  const roleCollection={
    user:userCollection,
    admin:adminCollection
  };
const q=query(userCollection,where("username","==",username));
  const getUser=await getDocs(q);
  if(!getUser.empty){
    throw new Error("El usuario ya existe")
  }
  if(!Object.keys(roleCollection).includes(saveUser.role)){
    throw new Error(`rol inválido: ${saveUser.role} no está permitido`)
  }
  await addDoc(roleCollection[saveUser.role],saveUser)
  return {message:"Usuario registrado correctamente"}
}
export const loginUser=async(username,password)=>{
  const q=query(userCollection,where("username","==",username));
  const user=await getDocs(q);
  if(user.empty){
    throw new Error("Usuario incorrecto")
  }
  const userDoc=user.docs[0];
  const userData=userDoc.data();
  const passwordMatch=await bcrypt.compare(password,userData.password);
  if(!passwordMatch){
    throw new Error("Contraseña incorrecta")
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

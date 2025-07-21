import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET=process.env.JWT_SECRET;
//función para generar el token
export const generateToken=(userData)=>{
  return jwt.sign(userData,JWT_SECRET,{expiresIn:"1h"})
}
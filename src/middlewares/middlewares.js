import "dotenv/config";
import jsonwebtoken from "jsonwebtoken";
const JWT_SECRET=process.env.JWT_SECRET;

//middleware para ruta protegida de autenticación de token
export const verifyToken=async(req,res,next)=>{
  try{
    const authHeader=req.headers.authorization;
    const token=authHeader?.split(" ")[1];
    if(!token){
      return res.status(401).json({error:"El token no existe"})
    }
    const decoded=jsonwebtoken.verify(token,JWT_SECRET);
    req.user=decoded;
    next()
  }catch(error){
    if(error.name === "TokenExpiredError"){
      return res.status(403).json({error:"El token ha expirado"})
    }
    if(error.name === "JsonWebTokenError"){
      return res.status(403).json({error:"El token es invalido"})
    }
    return res.status(403).json({error:"Error al verificar el token",message:error.name})
  }
}
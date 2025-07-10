import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
dotenv.config();
import router from "./src/routes/products.routes.js";
const app=express();
const  PORT=process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api",router);
app.use((req,res)=>{
  res.send("<h1>Archivo no encontrado</h1>")
})
app.use((error,req,res,next)=>{
  const statusCode=error.statusCode || 500;
  res.status(statusCode).json({error:error.message});
  if(process.env.NODE_ENV === "development"){
    console.log(error.stack)
  }
})
app.listen(PORT,()=>{
  console.log(`Conección estsblecida en el puerto ${PORT}`)
})
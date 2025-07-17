import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import {specs,swaggerUi} from "./swagger.js";
dotenv.config();
import router from "./src/routes/products.routes.js";
import authRouter from "./src/routes/users.routes.js"
import {errorHandler} from "./src/middlewares/error.js";
const app=express();
const  PORT=process.env.PORT || 4000;
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,"public")));
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));
app.use("/api",router);
app.use("/auth",authRouter);
app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"public","notFound.html"))
})
app.use(errorHandler);
app.listen(PORT,()=>{
  console.log(`Conección establecida en el puerto ${PORT}`)
})
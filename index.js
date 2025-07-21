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

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));//middleware para acceder a la documentación Swagger
app.use("/api",router);//prefijo para rutas sobre productos
app.use("/auth",authRouter);//prefijo para rutas sobre usuarios
app.use(express.static(path.join(__dirname,"public")));//middleware para acceder a la ubicación de mi archivo estático de ruta no encontrada

//middleware para manejar la respuesta de una ruta no encontrada
app.use((req, res) => {
  const acceptsHTML = req.headers.accept?.includes("text/html");
  
  if (acceptsHTML) {
    res.status(404).sendFile(path.join(__dirname, "public", "notFound.html"));
  }
  else {
    res.status(404).json({
      error: true,
      message: "Ruta no encontrada",
      statusCode: 404
    });
  }
});

app.use(errorHandler);//Middleware de manejo de errores
app.listen(PORT,()=>{
  console.log(`Conección establecida en el puerto ${PORT}`)
})
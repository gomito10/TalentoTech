
export const errorHandler=(error,req,res,next)=>{
  const statusCode=error.statusCode || 500;
  res.status(statusCode).json({error:error.message});
  if(process.env.NODE_ENV === "development"){
    console.log(error.stack)
  }
}
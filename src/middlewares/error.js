
export const errorHandler=(error,req,res,next)=>{
  const status=error.statusCode || 500;
  res.status(status).json({error:true,message:error.message,statusCode:status});
  if(process.env.NODE_ENV === "development"){
    console.log(error.stack)
  }
}
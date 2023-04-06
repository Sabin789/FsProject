import mongoose from "mongoose"

export const badRequestHandler=(err,req,res,next)=>{
    if(err.status===400||err instanceof mongoose.Error.ValidationError){
      res.status(400).send({succes:false,message: err.message, errorsList: err.errorsList? err.errorsList.map(e => e.msg):"" })
    }else if(err instanceof mongoose.Error.CastError ){
      res.status(400).send({message:"You sent a wrong id"})
    }else{
        next(err)
    }
}

 

export const unauthorizedErrorHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({ success: false, message: err.message })
  } else {
    next(err)
  }
}

export const notFoundHandler=(err,req,res,next)=>{
    if(err.status===404){
      res.status(404).send({succes:false,message: err.message })
  
    } else{
        next(err)
      }
  }

 export const genericErrorHandler=(err,req,res,next)=>{
    console.log("ERROR:", err)
    res.status(500).send({ success: false, message: "Something happened on our side! we will fix that ASAP!" })
  }
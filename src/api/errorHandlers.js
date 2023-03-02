export const badRequestHandler=(err,req,res,next)=>{
    if(err.status===400){
        res.status(400).send({succes:false,message: err.message, errorsList: err})
    }else{
        next(err)
    }
}
export const unauthorizedHandler=(err,req,res,next)=>{
  if(err.status===401){
    res.status(401).send({succes:false,message: err.message })

  }else{
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
import createHttpError from "http-errors"
import { verifyAccesToken } from "./auth/tools.js"

export const JWTAuthMiddleware=async(req,res,next)=>{
    if(!req.headers.authorization){
        next(createHttpError(401,"Plese provide a valid bearer token"))
    }else{
        const accessToken=req.headers.authorization.replace("Bearer ","")
      
        try {
            const payload=await verifyAccesToken(accessToken)
            req.author = { _id:payload._id, 
                role:payload.role,
            }
            next()
        } catch (error) {
            console.log(error)
            next(createHttpError(401, "Token not valid! Please log in again!"))
        }
    }
}
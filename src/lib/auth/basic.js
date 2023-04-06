import createHttpError from "http-errors"
import atob from "atob"
import authorModel from "../../api/validation/authorModel.js"

export const basicAuthMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {

        next(createHttpError(401, "Please provide credentials in Authorization header"))
      }else{
   
        const encodedCredentials = req.headers.authorization.replace("Basic ", "")

        const credentials=atob(encodedCredentials)
        const [email, password] = credentials.split(":")
   


        const author= await authorModel.checkCredentials(email,password)
        if(author){
            req.author=author
            next()
        }else{
            next(createHttpError(401, "Credentials are not ok!"))
        }

      }
}
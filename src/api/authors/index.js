import  Express  from "express";
import fs from "fs"
import { fileURLToPath } from "url"; 
import path, { dirname,join } from "path";
import createHttpError from "http-errors"
import authorModel from "../validation/authorModel.js";
import { basicAuthMiddleware } from "../../lib/auth/basic.js";
import { adminMiddleware } from "../../lib/auth/admin.js"
import { createAccesToken, createRefreshToken } from "../../lib/auth/tools.js";
import { JWTAuthMiddleware } from "../../lib/jwt.js";
import passport from "passport";

const AuthorsFileToJson=join(dirname(fileURLToPath(import.meta.url)),"../data/authors.json")
console.log(AuthorsFileToJson)
//1
const BlogsToJson=join(dirname(fileURLToPath(import.meta.url)),"../data/blogs.json")
console.log(BlogsToJson)

const AuthorRouter=Express.Router()  


//-------------2{


    AuthorRouter.get("/googleLogin",
    passport.authenticate("google",
    {scope:["profile","email"]}),
    (req,res,next)=>{
        try {
            res.send()
        } catch (error) {
            next(error)
        }
    })

    AuthorRouter.get("/googleRedirect",
    passport.authenticate("google"),
//    {session:false},
    (req,res,next)=>{
        try {
            res.redirect(`${process.env.mainUrl}?accessToken=${req.author.accessToken}`)
        } catch (error) {
            next(error)
        }
    })
    


AuthorRouter.post("/register", async (req,res,next)=>{
    try{
     const authors= await authorModel.find()

    const newAuthor=new authorModel(req.body)
    const exists=authors.find(a=>a.email===newAuthor.email)
    if(exists){
        res.send((createHttpError(400, `Author with email ${newAuthor.email} already exists!`))) 

    }else{
    const {_id}=await newAuthor.save()
    res.status(201).send({_id:_id})
    }


    }catch(err){
        next(err)
    }

 }
 )


AuthorRouter.get("/",JWTAuthMiddleware,adminMiddleware,async(req,res,next)=>{
//  const fileName=fs.readFileSync(AuthorsFileToJson)
//  const author=JSON.parse(fileName)
//  res.send(author)
try{
     const authors=await authorModel.find()
     res.send(authors)
}catch(err){
    next(err)
}
})




AuthorRouter.get("/me",JWTAuthMiddleware, async (req,res,next)=>{
    try{

        const user=await authorModel.findById(req.author._id)
        res.send(user)
   
    }catch(err){
        next(err)
    }
})
AuthorRouter.get("/me/stories",JWTAuthMiddleware, async (req,res,next)=>{
    try{

        const user=await authorModel.findById(req.author._id)
        const stories=  user.blogs//.populate({path:"Blog", select:["title"]})
        
        res.send(stories)

    }catch(err){
        next(err)
    }
})

AuthorRouter.put("/me",JWTAuthMiddleware, async (req,res,next)=>{
    try{
        const updated=await authorModel.findOneAndUpdate(
            {_id:req.author._id},
            req.body,
            {new:true, runValidators:true}
            )
        res.send(updated)
  
    }catch(err){
        next(err)
    }
})

AuthorRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
    try {
      await authorModel.findOneAndDelete(req.author._id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  })

AuthorRouter.get("/:authorId",JWTAuthMiddleware,adminMiddleware,async(req,res,next)=>{
    try{
        const author=await authorModel.findById(req.params.authorId)
        if(author){
         res.send(author)
        }else{
         res.send((createHttpError(404, `Author with id ${req.params.authorId} not found!`))) 

        }
       
    }catch(err){
        next(err)
    }
 
})

AuthorRouter.put("/:authorId",JWTAuthMiddleware,adminMiddleware,async(req,res,next)=>{
    try{
        let updated=await authorModel.findByIdAndUpdate(
            req.params.authorId,
            req.body,
            {new:true,runValidators:true}
        
        )
        if(updated){
            res.send(updated)
        }else{
            next(createHttpError(404, `Author with id ${req.params.authorId} not found!`))
        
        }
    }catch(err){
        next(err)
    }
  
})


AuthorRouter.delete("/:authorId",JWTAuthMiddleware,adminMiddleware,async(req,res,next)=>{
    try{
        const deleted= await authorModel.findByIdAndDelete(req.params.authorId)
        if(deleted){
            res.status(204).send()
        }
    }catch(err){
        next(err)
    }

})

AuthorRouter.post("/login", async(req,res,next)=>{
    try {
        const {email,password}=req.body

     const author=await authorModel.checkCredentials(email,password)
     if(author){
   const payload={_id:author._id,role:author.role}
   console.log(payload)
   const accessToken=await createAccesToken(payload)
   const refreshToken=await createRefreshToken({_id:author._id})
   res.send({accessToken})
   console.log({accessToken})
     }else{
        next(createHttpError(401,"Invalid Credentials"))
     }
    } catch (error) {
        next(error)
    }
})



//----------}

// AuthorRouter.get("/:authorId/blogPosts",(req,res)=>{
//     const fileName=fs.readFileSync(AuthorsFileToJson)
//     const author=JSON.parse(fileName)
//     const blogFileName=fs.readFileSync(BlogsToJson)
//     const array=JSON.parse(blogFileName)
//     const singleAuthor=author.find(a=>a.id===req.params.authorId)
//     const corresponding=array.filter(a=>a.author.name===singleAuthor.name)
//     res.send(corresponding)
// })

// AuthorRouter.post("/:authorId/register", async(req,res,next)=>{
//     try{
//         const fileName=fs.readFileSync(AuthorsFileToJson)
//         const author=JSON.parse(fileName)
//         const singleAuthor=author.find(a=>a.id===req.params.authorId)
//         // const {email}=singleAuthor
//          sendRegistrationEmail(singleAuthor.email)
//         res.send("sent to "+singleAuthor.email)
//     }catch(err){
//         console.log(err)
//     }
// })


export default  AuthorRouter
import  Express  from "express";
import fs from "fs"
import { fileURLToPath } from "url"; 
import { dirname,join } from "path";
import createHttpError from "http-errors"
import authorModel from "../validation/authorModel.js";
const AuthorsFileToJson=join(dirname(fileURLToPath(import.meta.url)),"../data/authors.json")
console.log(AuthorsFileToJson)
//1
const BlogsToJson=join(dirname(fileURLToPath(import.meta.url)),"../data/blogs.json")
console.log(BlogsToJson)

const AuthorRouter=Express.Router()  


//-------------2{
AuthorRouter.post("/",async (req,res,next)=>{
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


AuthorRouter.get("/",async(req,res,next)=>{
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


AuthorRouter.get("/:authorId",async(req,res,next)=>{
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

AuthorRouter.put("/:authorId",async(req,res,next)=>{
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


AuthorRouter.delete("/:authorId",async(req,res,next)=>{
    try{
        const deleted= await authorModel.findByIdAndDelete(req.params.authorId)
        if(deleted){
            res.status(204).send()
        }
    }catch(err){
        next(err)
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
import  Express  from "express";
import { writeFile } from "fs";
import multer from "multer"
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { getAuthors, getBlogs, saveUserAvatar, WriteAuthor, writeBook } from "../../lib/fs-tools.js";
import pipeline from "stream"
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { checkBlogSchema } from "../authors/validation.js";
import blogSchema from "../validation/model.js";

const filesRouter=Express.Router()
   
const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary, // cloudinary is going to search for smth in .env vars called process.env.CLOUDINARY_URL
      params: {
        folder: "fs0522/cover",
      },
    }),
  }).single("cover")

  filesRouter.post("/:blogId/upload", cloudinaryUploader,async(req,res,next)=>{

    try{
        const blog=await blogSchema.findById(req.params.blogId)


      if(blog){
     blog.cover=req.file.path
  
     blog.save()
         res.send({message:"file Uploaded"})
      }else{

        res.status(400)
      }
    }catch(err){
       
     next(err)
    }
  })
// filesRouter.get("/:id/upload",async(req,res,next)=>{
//     try{
//         const blogs=await getBlogs()
//         const foundBlog=blogs.find(b=>b._id===req.params.id)
//         if(foundBlog){
//          res.setHeader("Content-Disposition",`attachment; filename=${foundBlog.title}.json.gz`)
//         }
//         const source= await getReadableStream()
//         const destination=res
//         const transform=createGzip()
//         pipeline(source,transform,destination,err =>{
//             if(err){console.log(err)}else{
//                 console.log("Compressed json")
//             }
//         })
//     }catch(err){
//         next(err)
//     }
// })






export default filesRouter
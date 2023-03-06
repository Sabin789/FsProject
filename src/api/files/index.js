import  Express  from "express";
import { writeFile } from "fs";
import multer from "multer"
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { getAuthors, getBlogs, saveUserAvatar, WriteAuthor, writeBook } from "../../lib/fs-tools.js";
const filesRouter=Express.Router()

// cloudinary.config({ 
//     cloud_name: 'sample', 
//     api_key: "874837483274837",
//     api_secret: 'a676b67565c6767a6767d6767f676fe1'
// })
// const cloudinaryUploader =multer({
//     storage:new CloudinaryStorage({
//     cloudinary,
//     params:{folder:"fs0522/users"}
//     })
// }).single("avatar")

// filesRouter.post("/single/:userId", cloudinaryUploader,async(req,res,next)=>{
//     try{
//       const authors= await getAuthors()
//       const singleAuthor= authors.find(p=>p._id===req.params.userId)
      
    
//       if(singleAuthor){
//           const originalFileExt=extname(req.file.originalname)
//          const fileName=req.params.productId+originalFileExt
  
//       saveUserAvatar(fileName,req.file.buffer)
      
//      singleProduct.avatar=`http://localhost:3001/Public/img/${fileName}`
//      await WriteAuthor(authors)
//          res.send({message:"file Uploaded"})
//       }else{
//         res.status(400)
//       }
//     }catch(err){
//      next(err)
//     }
//   })

export default filesRouter
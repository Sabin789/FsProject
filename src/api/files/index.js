import  Express  from "express";
import multer from "multer"
import { extname } from "path";
import { Await } from "react-router-dom";
import { saveUserAvatar } from "../../lib/fs-tools.js";
const filesRouter=Express.Router()

filesRouter.post("/single",  multer().single("avatar"),async (req,res,next)=>{
    try{
     console.log("File: ",req.file)
     res.send({message:"fileUploaded"})
    }catch(err){
        console.log(err)
    }
})

filesRouter.post("/blogPosts/:blogId/uploadCover",  multer().array(),async (req,res,next)=>{
    try{
        const originalFileExt=extname(req.file.originalname)
        const fileName=req.params.blogId+originalFileExt
     await  saveUserAvatar(fileName,req.file.buffer)
       res.send({message:"file Uploaded"})
    }catch(err){
        next(err)
    }
})

export default filesRouter
import  Express  from "express";
import uniqid from "uniqid"
import { notFoundHandler } from "../errorHandlers.js";
import createHttpError from "http-errors"
import { getBlogs,writeBook } from "../../lib/fs-tools.js";
import multer from "multer"
import { extname } from "path";
import blogSchema from "../validation/model.js";
import { saveUserAvatar } from "../../lib/fs-tools.js";


// const BlogsToJson=join(dirname(fileURLToPath(import.meta.url)),"../data/blogs.json")
// console.log(BlogsToJson)
// console.log(BlogsToJson)

const BlogsRouter=Express.Router()  
// const getBlogs2 =()=>JSON.parse(fs.readFileSync(BlogsToJson))
// const writeBook=(blogsArray)=>fs.writeFileSync(BlogsToJson,JSON.stringify(blogsArray))



BlogsRouter.post("/",async(req,res,next)=>{
    try{

  const newBlog=new blogSchema(req.body)
const {_id}=await newBlog.save()
  
 res.status(201).send({_id:_id})



    }catch(err){
  
return  next(err)     }
  
})


BlogsRouter.get("/",async(req,res,next)=>{
try{
    // const blogs=await getBlogs()
    // if(req.query && req.query.title){
    //     const filteredBlogs=blogs.filter(b=>b.title===req.query.title)
    //     res.send(filteredBlogs)
      
    // }else{
    // res.send(blogs)
    // console.log("hello")
    // }
    const blogs=await blogSchema.find()
    res.send(blogs)
}catch(err){
     res.send(next(err))
    }


})


BlogsRouter.get("/:blogId",notFoundHandler,async(req,res,next)=>{
    try{
//     const blogs= await getBlogs()
//    const singleBlog=await blogs.find(s=>s._id===req.params.blogId)
//    if(singleBlog){
//    res.send(singleBlog)

//    else{
//     res.send((createHttpError(404, `Book with id ${req.params.bookId} not found!`))) 
//    }
const blog=await blogSchema.findById(req.params.blogId)
   if(blog){
res.send(blog)
   }else{
    res.send((createHttpError(404, `Blog with id ${req.params.bookId} not found!`))) 
   }
}catch(err){
    res.send(next(err))
}
})


BlogsRouter.put("/:blogId",async (req,res,next)=>{
    try{
//     const blogs=await getBlogs()
//     const index=blogs.findIndex(a=>a._id===req.params.blogId)

//   const  currentBlog=blogs[index]
//   const updated={...currentBlog,...req.body}
//   blogs[index]=updated
//   await writeBook(blogs)
//   res.send(updated)
let updated=await blogSchema.findByIdAndUpdate(
    req.params.blogId,
    req.body,
    {new:true,runValidators:true}

)
if(updated){
    res.send(updated)
}else{
    next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))

}
    }catch(err){
       next(err)
    }

})


BlogsRouter.delete("/:blogId",async(req,res,next)=>{
    try{
//     const blogs=await getBlogs()
//     const remaining=blogs.filter(a=>a._id!==req.params.blogId)
//    await writeBook(remaining)
const deleted= await blogSchema.findByIdAndDelete(req.params.blogId)
   if(deleted){
    res.status(204).send()
   }else{

   }
    }catch(err){
        next(err)
    }
})

BlogsRouter.post("/:blogId/comments",async(req,res)=>{
    try{
        const blogs = await getBlogs();
        const newComment = { ...req.body, id: uniqid() };
        
        if (newComment) {
            const index=blogs.findIndex(a=>a._id===req.params.blogId)

            const  currentBlog=blogs[index]
            const commentsArray=currentBlog.comments
          commentsArray.push(newComment)
          await writeBook(blogs)
          res.status(201).send({ id:newComment.id});
        }
    }catch(err){
        console.log(err)
    }
})

BlogsRouter.get("/:blogId/comments",async(req,res)=>{
    try{
        const blogs = await getBlogs();
        const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

  
        const commentsArray=singleBlog.comments
        res.status(200).send(commentsArray);
    }catch(err){
        console.log(err)
    }
})

BlogsRouter.post("/blogPosts/:blogId/uploadCover",  multer().single(),async (req,res,next)=>{
    try{
        console.log(req.file)
        const originalFileExt=extname(req.file.originalname)
        const fileName=req.params.blogId+originalFileExt
       saveUserAvatar(fileName,req.file.buffer)
       res.send({message:"file Uploaded"})
    }catch(err){
        next(err)
    }
})

BlogsRouter.get("/:blogId/comments/:commentId",async(req,res)=>{
    try{
        const blogs = await getBlogs();
        const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

  
        const commentsArray=singleBlog.comments
       const  singleComment= await commentsArray.find(s=>s.id===req.params.commentId)
        res.status(200).send(singleComment);
    }catch(err){
        console.log(err)
    }
})

BlogsRouter.put("/:blogId/comments/:commentId",async(req,res)=>{
    try{
        const blogs = await getBlogs();
        const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

  
        const commentsArray=singleBlog.comments
       const  index= await commentsArray.findIndex(s=>s.id===req.params.commentId)
        const currentComment=commentsArray[index]
        const updated={...currentComment,...req.body}
        commentsArray[index]=updated
        await writeBook(blogs)
        res.send(updated)
   


    }catch(err){

    }
})

BlogsRouter.delete("/:blogId/comments/:commentId",async(req,res)=>{
    try{
        const blogs=await getBlogs()
        const singleBlog=await blogs.find(s=>s._id===req.params.blogId)
        const commentsArray=singleBlog.comments

        const remaining=commentsArray.filter(a=>a._id!==req.params.commentId)
       await writeBook(remaining)
        res.status(204).send()
    }catch(err){
     console.log(err)
    }
})




export default BlogsRouter 
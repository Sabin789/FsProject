import  Express  from "express";
import uniqid from "uniqid"
import { notFoundHandler } from "../errorHandlers.js";
import createHttpError from "http-errors"
import { getBlogs,writeBook } from "../../lib/fs-tools.js";
import multer from "multer"
import { extname } from "path";
import blogSchema from "../validation/model.js";
import { saveUserAvatar } from "../../lib/fs-tools.js";
import q2m from "query-to-mongo"
import authorModel from "../validation/authorModel.js";
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
    console.log("req.query:", req.query)
    console.log("q2m:", q2m(req.query))
    const mongoQuery = q2m(req.query)

    const allBlogs = await blogSchema.find(mongoQuery.criteria, mongoQuery.options.fields)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({path:"authors",select:"email name"})
      .populate({path:"likes",select:"email name"})
    const total = await blogSchema.countDocuments(mongoQuery.criteria)
    res.send({
      links: mongoQuery.links("http://localhost:3003/blogPosts/", total),
      total,
      numberOfPages: Math.ceil(total / mongoQuery.options.limit),
      allBlogs,
    })
}catch(err){
     res.send(next(err))
    }


})


BlogsRouter.get("/:blogId",notFoundHandler,async(req,res,next)=>{
    try{
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
    
     
        const newComment=req.body

        const updatedBlog=await blogSchema.findByIdAndUpdate(
            req.params.blogId,
            {$push:{comments:newComment}},
            { new: true, runValidators: true }
        )

        if(updatedBlog){
            res.send(updatedBlog)
        }
      

    //     const newComment=new Commment(req.body)
        
    // //    const {_id}=await newComment.save()
    //     if (newComment) {
           
    //         const blog=await blogSchema.findById(req.params.blogId)
            
    //         const commentsArray=blog
    //       commentsArray.push(newComment)
      
    //       res.status(201).send({ id:newComment.id});
    //     }
    }catch(err){
        console.log(err)
    }
})

BlogsRouter.get("/:blogId/comments",async(req,res,next)=>{
    try{
        // const blogs = await getBlogs();
        // const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

  
        // const commentsArray=singleBlog.comments
        // res.status(200).send(commentsArray);
        let blog=await blogSchema.findById(req.params.blogId)
        if(blog){
            
          res.send(blog.comments)
        }else{
            next(createHttpError(404, `Blog with id ${req.body.blogId} not found!`))

        }
    }catch(err){
       next(err)
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

BlogsRouter.get("/:blogId/comments/:commentId",async(req,res,next)=>{
    try{
    //     const blogs = await getBlogs();
    //     const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

  
    //     const commentsArray=singleBlog.comments
    //    const  singleComment= await commentsArray.find(s=>s.id===req.params.commentId)
    //     res.status(200).send(singleComment);
    const blog=await blogSchema.findById(req.params.blogId)
    const comment= blog.comments.find(book => book._id.toString() === req.params.commentId)
    if(comment){
        res.send(comment)
    }else {
        next(createHttpError(404, `Comment with id ${req.body.commentId} not found!`))
      }
    }catch(err){
       next(err)
    }
})

BlogsRouter.put("/:blogId/comments/:commentId",async(req,res,next)=>{
    try{
    //     const blogs = await getBlogs();
    //     const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

  
    //     const commentsArray=singleBlog.comments
    //    const  index= await commentsArray.findIndex(s=>s.id===req.params.commentId)
    //     const currentComment=commentsArray[index]
    //     const updated={...currentComment,...req.body}
    //     commentsArray[index]=updated
    //     await writeBook(blogs)
    //     res.send(updated)
   
    const blog=await blogSchema.findById(req.params.blogId)
    if(blog){
  
        let index= blog.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
     
        if(index!==-1){
            blog.comments[index]={...blog.comments[index],_id: req.params.commentId,...req.body}
            await blog.save()
            res.send(blog)
        }else{
          next(createHttpError(404, `Comment with id ${req.body.commentId} not found!`))
        }
    }else{
        next(createHttpError(404, `Blog with id ${req.body.blogId} not found!`))

    }
  
   
    }catch(err){
    next(err)
    }
})

BlogsRouter.delete("/:blogId/comments/:commentId",async(req,res,next)=>{
    try{
        // const blogs=await getBlogs()
        // const singleBlog=await blogs.find(s=>s._id===req.params.blogId)

        // const commentsArray=singleBlog.comments

    //     const remaining=commentsArray.filter(a=>a._id!==req.params.commentId)
    //    await writeBook(remaining)
    //     res.status(204).send()
    const updatedBlog = await blogSchema.findByIdAndUpdate(
        req.params.blogId, // WHO
        { $pull: { comments: { _id: req.params.commentId } } }, // HOW
        { new: true, runValidators: true } // OPTIONS
      )
      if (updatedBlog) {
        res.send(updatedBlog)
      } else {
        next(createHttpError(404, `User with id ${req.params.userId} not found!`))
      }
    }catch(err){
   next(err)
    }
})


//Embedded

BlogsRouter.post("/:blogId/")



export default BlogsRouter 
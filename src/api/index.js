
import  Express  from "express";
import listEndpoints from "express-list-endpoints";
import AuthorRouter from "./authors/index.js";
import { dirname,join } from "path";
import cors from 'cors';
import BlogsRouter from "./books/index.js";
import { badRequestHandler, genericErrorHandler, notFoundHandler, unauthorizedHandler } from "./errorHandlers.js";
import filesRouter from "./files/index.js";

const app=Express()

const port=3003
// const loggerMiddleware=(req,res,next)=>{
//     console.log(`reqest middleware ${req.method} url ${req.url}  ${new Date()}`)
//     next()
// }
const publicFolderPath=join(process.cwd(),"./public")
//If it has next is it slikely a middleaware
// app.use(loggerMiddleware)
app.use(Express.static(publicFolderPath))
app.use(cors())
app.use(Express.json())

//It needs to alwys be b4 the endpoints
app.use("/authors",AuthorRouter)
app.use("/blogPosts",BlogsRouter)
app.use("/files",filesRouter)
//unless they are error handlers in wihich case they shoudl be after th endpoints


app.use(badRequestHandler)
app.use(unauthorizedHandler) 
app.use(notFoundHandler) 
app.use(genericErrorHandler)

app.listen(port,()=>{
    // console.table(listEndpoints(app))
    console.log(`Server running on port ${port}`)
})

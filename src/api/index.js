import createHttpError from "http-errors"
import  Express  from "express";
import listEndpoints from "express-list-endpoints";
import AuthorRouter from "./authors/index.js";
import { dirname,join } from "path";
import cors from 'cors';
import BlogsRouter from "./books/index.js";
import { badRequestHandler, genericErrorHandler, notFoundHandler, unauthorizedErrorHandler,forbiddenErrorHandler } from "./errorHandlers.js";
import filesRouter from "./files/index.js";
import mongoose from "mongoose";
import passport from "passport";
import googleStartegy from "../lib/auth/googleAuth.js";
const app=Express()

const port=3003
// const loggerMiddleware=(req,res,next)=>{
//     console.log(`reqest middleware ${req.method} url ${req.url}  ${new Date()}`)
//     next()
// }
const publicFolderPath=join(process.cwd(),"./public")

passport.use("google", googleStartegy)

const whiteList = ["http://localhost:3000"]
//If it has next is it slikely a middleaware
// app.use(loggerMiddleware)
const corsOpt = {
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whiteList.indexOf(currentOrigin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`)
        );
      }
    },
  };
app.use(Express.static(publicFolderPath))
app.use(cors(corsOpt))
app.use(Express.json())
app.use(passport.initialize())

//It needs to alwys be b4 the endpoints
app.use("/authors",AuthorRouter)
app.use("/blogPosts",BlogsRouter)
app.use("/blogPosts",filesRouter)
// app.use("/files",filesRouter)
//unless they are error handlers in wihich case they shoudl be after th endpoints


app.use(badRequestHandler)
app.use(unauthorizedErrorHandler) 
app.use(forbiddenErrorHandler) 
app.use(notFoundHandler) 
app.use(genericErrorHandler)


mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on("connected",()=>{
    console.log("succesfully connected to mongo")
})

app.listen(port,()=>{
    // console.table(listEndpoints(app))
    console.log(`Server running on port ${port}`)
})

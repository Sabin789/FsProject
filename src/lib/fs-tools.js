import fs from "fs-extra"
import { fileURLToPath } from "url"; 
import { dirname,join } from "path";
import { writeFile, writeFileSync } from "fs";

const {readJSON,writeJSON}=fs


const dataFloderPath=join(dirname(fileURLToPath(import.meta.url)),"../api/data")

const AuthorsFileToJson=join(dataFloderPath,"authors.json")

const BlogsToJson=join(dataFloderPath,"blogs.json")

 const userPubliFolderPath=join(dirname(process.cwd()),"./public/img/blogPosts")
// console.log(userPubliFolderPath)
export const getAuthors=()=>readJSON(AuthorsFileToJson)
export const WriteAuthor=authorArray=>writeJSON(AuthorsFileToJson,authorArray)
export const getBlogs=()=>readJSON(BlogsToJson)
export const writeBook=BlogsArray=>writeJSON(BlogsToJson,BlogsArray)
export const saveUserAvatar= (fileName,fileContentAsBuffer)=>writeFileSync(join(userPubliFolderPath, fileName), fileContentAsBuffer)
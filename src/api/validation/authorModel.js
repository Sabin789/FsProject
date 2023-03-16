
import mongoose, { model } from "mongoose"


const {Schema}=mongoose
const authorSchema=new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    DOB:{type:String,required:true},
    avatar:{type:String},
    email:{type:String,required:true}
},
{timestamps:true}
)

export default model("Author",authorSchema)


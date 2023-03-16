import mongoose, { model } from "mongoose"


const {Schema}=mongoose


const likeSchema=new Schema({
  allLikes:{type:mongoose.Types.ObjectId, ref:"Author"},
  status:{type:String, enum:["Liked","Inactive"]}
},{timestamps:true})
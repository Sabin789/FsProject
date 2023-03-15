import mongoose, { model } from "mongoose"


const {Schema}=mongoose
const blogSchema= new Schema({
    category: { type: String, required: true , minLength: 3, maxLength: 12},
    title:{type:String,required:true,minLength: 3, maxLength: 12},
    cover:{type:String,default:""},
    readTime:{
        value:{type:Number,required:true},
        unit:{type:String,required:true,enum: ["history", "romance", "horror", "fantasy"],}
    },
    author:{
        name:{type:String ,required:true,minLength: 3, maxLength: 12},
        avatar:{type:String,default:""}
    },
    comments:[
        {
            comment:{type:String,required:true},
            rate:{type:Number,min:1,max:5}
        },
        {timestamps:true}
    ]
},
{timestamps:true}//makes created and updated at
)



export default  model("Blog",blogSchema) //links to the collection or makes it 
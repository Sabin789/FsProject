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
    authors:[{type:Schema.Types.ObjectId, ref:"Author"}],
    comments:[
        {
            comment:{type:String,required:true},
            rate:{type:Number,min:1,max:5}
        },
        {timestamps:true}
    ],
    likes:[{type:Schema.Types.ObjectId, ref:"Author"}],
    content:{type:String}
},
{timestamps:true}//makes created and updated at
)

blogSchema.static("FindAll",async  function (query){

    const allBlogs = await this.find(query.criteria, query.options.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({path:"authors",select:"email"})
  const total = await this.countDocuments(query.criteria)
  return {allBlogs,total}
})


export default  model("Blog",blogSchema) //links to the collection or makes it 
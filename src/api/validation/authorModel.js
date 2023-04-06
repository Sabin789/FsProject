
import mongoose, { model } from "mongoose"
import bcrypt from "bcrypt"

const {Schema}=mongoose
const authorSchema=new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    DOB:{type:String,required:true},
    avatar:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role: { type: String, required: true, enum: ["Admin", "User"], default: "User" },
    blogs:[{type:mongoose.Types.ObjectId, ref:"Blog"}],
    refreshToken:{type:String},
    googleId:{type:String}
},
{timestamps:true}
)

authorSchema.pre("save",async function(){
 const newAuthor=this
if(newAuthor.isModified("password")){
    const plainPw=newAuthor.password
    const hash=await bcrypt.hash(plainPw,6)
    newAuthor.password=hash
}
})


authorSchema.methods.toJSON=function(){
    const authorDoc = this;
  const authorObject = authorDoc.toObject()
  delete authorObject.password
  delete authorObject.createdAt
  delete authorObject.updatedAt
  delete authorObject.__v
  return authorObject
}


authorSchema.static("checkCredentials", async function (email, plainPW){
    const author = await this.findOne({ email })

    if (author) {
        const passwordMatch = await bcrypt.compare(plainPW, author.password)
         
        if (passwordMatch) {
        
          return author
        } else {
     
          return null
         
        }
      } else {
       
        return null
      }
})

//jwt takes secret(header) payload and options(signature)


export default model("Author",authorSchema)


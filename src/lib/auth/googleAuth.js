
import GoogleStartegy from "passport-google-oauth20"
import authorModel from "../../api/validation/authorModel.js"
import { createAccesToken } from "./tools.js"


const googleStartegy=new GoogleStartegy({
    clientID:process.env.GOOGLE_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackUrl:`${process.env.API_URL}/authors/googleRedirect`
},
function(accessToken,__,profile,passportNext){
try{
    const {email,given_name,familly_name,sub}=profile._json
  console.log("Profile:", profile)

  const author = authorModel.findOne({ email })
 if(author){

 }else{
    const newAuthor=new authorModel({
        name:given_name,
        surname:familly_name,
        email,
        googleId:sub,
    })
    const createdUser= newAuthor.save()
   accessToken= createAccesToken({_id:createdUser._id,role:createdUser.role})
    passportNext(null,{accessToken})
 }
}catch(err){
    passportNext(err)
}
}
)


export default googleStartegy
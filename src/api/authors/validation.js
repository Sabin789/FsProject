import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const blogSchema={

    category: {
        in: ["body"],
        isString: {
          errorMessage: "Category is a mandatory field and needs to be a string!",
        },
      },
  title:{
  in:["body"],
  isString: {
    errorMessage: "Title is a mandatory field and needs to be a string!",
  },
},
 cover:{
    in:["body"],
    isString:{
        errorMessage: "Cover is a mandatory field and needs to be a string!",

    }
 },
 readTime:{
    in:["body"],
    value:{
        in:["body"],
        isNumber:{
            errorMessage:"Value is a mandatory field and needs to be a number!",
        },
        unit:{
            in:["body"],
            isString:{
                errorMessage:"Unit is a mandatory field and needs to be a string!",

            }
        }
    }
 },
 author:{
    in:["body"],
    name:{
        in:["body"],
        isString:{
            errorMessage:"Name is a mandatory field and needs to be a string!",
        },
        
        avatar:{
            in:["body"],
            isString:{
                errorMessage:"Avatar is a mandatory field and needs to be a string!",
        }
    }
 }


}
}


const authorSchema={
    name:{
        in:["body"],
        isString:{
            errorMessage:"Name is a mandatory field and needs to be a string!",
        }
    },
        surname:{
            in:["body"],
            isString:{
                errorMessage:"Surname is a mandatory field and needs to be a string!",
            }
        },
        email:{
            in:["body"],
            isString:{
                errorMessage:"Email is a mandatory field and needs to be an email!",
            },
        },
        DOB:{
            in:["body"],
            isString:{
                errorMessage:"DOB is a mandatory field and needs to be a string!",
            },
        },
        avatar:{
            in:["body"],
            isString:{
                errorMessage:"Avatar is a mandatory field and needs to be a string!",
            },
        }

}

const searchSchema = {
    title: {
      in: ["query"],
      isString: {
        errorMessage:
          "title must be in query and type must be  string to search!",
      },
    },
  }


export const checkBlogSchema = checkSchema(blogSchema)
export const checkSearchSchema = checkSchema(searchSchema)
export const checkAuthorSchema=checkSchema(authorSchema)

export const triggerBadeRequest=(req,res,next)=>{
    const errors=validationResult(req)
    console.log(errors.array())
    if (errors.isEmpty()) {
        
        next()
      } else {
   
        next(createHttpError(400, "Errors during book validation", { errorsList: errors.array() }))
      }

}

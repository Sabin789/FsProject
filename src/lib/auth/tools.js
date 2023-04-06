import jwt from "jsonwebtoken";

const secret=process.env.JWT_SECRET
const refSecret=process.env.REFRESH_SECRET
const options={expiresIn:"15m"}
const refOptions={expiresIn:"1 day"}

export const createTokens=async author=>{
const accesToken=  await createAccesToken({_id:author._id, role:author.role})
 const refreshToken= await createRefreshToken({_id:author._id})
}


export const createAccesToken=async payload=>{
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,secret,options, (err,token)=>{
            if (err) reject(err)
            else resolve(token)
        })
    })
}

export const createRefreshToken=async payload=>{
  return new Promise((resolve,reject)=>{
      jwt.sign(payload,refSecret,refOptions, (err,token)=>{
          if (err) reject(err)
          else resolve(token)
      })
  })
}

export const verifyAccesToken = async (accessToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

export const verifyRefreshToken = async (accessToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, refSecret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};
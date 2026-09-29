import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {createAccessToken,createRefreshToken,readRefreshToken,readAccessToken} from '../utils/auth.util.js';
import cookieParser from 'cookie-parser';

// @description Register User and save data from req.body to database
// params req.body ={email,name,password}
// params req.body  object
// params req express.request
// params req.body.email string
// params req.body.name string
// params req.body.password string


export async function registerUser(req,res)
{
    const {email,name,password} = req.body;
    const isUserAlreadyExist = await userModel.findOne({
        email
    })
    if(isUserAlreadyExist){
        return res.status(400).json({
            message:'User already exist with this email',
            errors :{
                field:'email',
                message:'User already exist with this email'
            }
        })
    }

    const user = await userModel.create({
        email,
        name,  
        passwordHash:await bcrypt.hash(password,12)
    })
    const accessToken = createAccessToken({
        userId:user._id,
        role:user.role});
        const refreshToken = createRefreshToken({
            userId:user._id,
            role:user.role});

      res.cookie("refreshToken",refreshToken,{
          httpOnly:true,
      })
await userModel.findByIdAndUpdate(user._id, {
    refreshToken: refreshToken
})

      res.status(201).json({
          message:'User registered successfully',
          data:{
             user :{
                 email:user.email,
              name:user.name,
              id:user._id,
             },accessToken
          }
      })
}

// @description Login User and create a new set of access and refresh token
// params req.body.email string
// params req.body.password string

export async function loginUser(req,res){
const {email,password} = req.body;
const user = await userModel.findOne({
    email
})
  if(!user){
    return res.status(400).json({
        message:"invalid email or password",
    })
  }
  const isPasswordValid = await bcrypt.compare(password,user.passwordHash);
  if(!isPasswordValid){
      return res.status(400).json({
          message:"invalid email or password",
      })
  }
  const accessToken = createAccessToken({
      userId:user._id,
      role:user.role
  })
  const refreshToken = createRefreshToken({
      userId:user._id,
      role:user.role
  })
 await userModel.findByIdAndUpdate(user._id, {
    refreshToken: refreshToken
});

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
    })
   res.status(200).json({
       message:'User logged in successfully',
       data:{
           user:{
               email:user.email,
               name:user.name,
               id:user._id,
           },
           accessToken
       }
   })
}

export async function refresh(req,res){
    
    const refreshToken = req.cookies.refreshToken;
    // console.log(refreshToken,'refreshToken')
  
    if(!refreshToken){
        return res.status(400).json({
            message:'refresh token is required',
        })
    }
    try{
        const decoded =readRefreshToken(refreshToken);
        const {userId,role} = decoded;
        const user = await userModel.findOne({_id:userId});
        if(refreshToken!=user.refreshToken){
          await userModel.findByIdAndUpdate(userId,{
            refreshToken:null
          })
          return res.status(401).json({
              message:' refresh token mismatch',
          })
        }
        const accessToken = createAccessToken({
            userId:user._id,
            role:user.role
        })
        const newRefreshToken = createRefreshToken({
            userId:user._id,
            role:user.role
        })
        await userModel.findByIdAndUpdate(userId,{
            refreshToken:newRefreshToken
        })
        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
        })
        res.status(200).json({
            message:' token rotated successfully',
            user:{
                email:user.email,
                name:user.name,
                id:user._id,
            },accessToken
        })

    }catch(error){
      return res.status(401).json({
           message:'Invalid refresh token',
      })
    }
}

export async function getMe(req,res){
   const { userId, role } = req.user;   

    const user = await userModel.findById(userId);
    res.status(200).json({
        message:'User data fetched successfully',
        data:{
            user:{
                email:user.email,
                name:user.name,
                id:user._id,
            }
        }
    })

}
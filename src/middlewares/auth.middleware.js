import {readAccessToken} from '../utils/auth.util.js';


export function authenticate(req,res,next){
    const accessToken = req.headers.authorization?.split(' ')[1];
    if(!accessToken){
        return res.status(401).json({
            message:"access token not found in the request header"
        })
    }
    try{
      const decoded = readAccessToken(accessToken);
     req.user = decoded;
     next()
    
    }catch(error){
        return res.status(401).json({
            message:"invalid or expired access token"
        })  
    }

}


export async function authenticateSeller(req,res,next){
    if(req.user.role!=="seller"){
        return res.status(403).json({
            message:"user is not authorize to perform this action"
        })
    }next()
}
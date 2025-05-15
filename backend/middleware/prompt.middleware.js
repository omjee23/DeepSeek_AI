import jwt from "jsonwebtoken";
import config from '../config.js'

export const userMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: "Unauthorized Token missing"})
    }
    const token = authHeader.split(' ')[1]
    try {
        const decode = jwt.verify(token,config.JWtKey)
        console.log("decode data is coming " , decode);
        
        req.userId = decode.id
        next()
    } catch (error) {
        console.log(error ,"middleware error");
        return res.status(401).json({error: "Unauthorized token"})  
    }
}
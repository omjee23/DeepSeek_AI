import { User } from '../model/user.model.js'
import config from '../config.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signUP = async (req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    try {
        const user = await User.findOne({email:email})
        if(user){
            return res.status(401).json({error: "user already exist"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const newUser = new User({firstName,lastName,email,password:hashPassword})
        await newUser.save()
        return res.status(401).json({message: "user signup successfully "})
    } catch (error) {
        console.log("signup Error", error); 
        return res.status(500).json({error: "Error in signup"})
    }
}

export const login = async(req,res)=>{
   const {email,password}=req.body;
   try {
    const user = await User.findOne({email:email})
    const isPassword = await bcrypt.compare(password,user.password)
    if(!user || !isPassword){
        return res.status(401).json({error: "Invalid email or password"})
    }
    // token code ...
    const token = jwt.sign({id:user._id},config.JWtKey,{expiresIn: "1d"} )
    const cookieOption = {
        expires:  new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite:"strict"
    }
    res.cookie('jwt',token ,cookieOption)
    return res.status(200).json({message: "login successfully ",user,token})
   } catch (error) {
    console.log("Error in login", error);
    return res.status(500).json({error: "login error"}) 
   } 
}

export const forgetPassword = async(req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(401).json({error: "user not found"})
        }
        
    
    } catch (error) {
        
    }
    
}

export const resetPassword = (req,res)=>{
    // const {name,email,password} = req.body;
    console.log("resetPassword please");
    
}

export const logout= (req,res)=>{
    // const {name,email,password} = req.body;
    console.log("logout please");
    
}
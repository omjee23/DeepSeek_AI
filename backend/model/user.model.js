import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }, 
  otp: {
    token: {
        type: Number
    },
    expires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}

})

export const User = mongoose.model("User", userSchema);
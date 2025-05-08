import { User } from "../model/user.model.js";
import config from "../config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const signUP = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(401).json({ error: "user already exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email:email.toLowerCase(),
      password: hashPassword,
    });
    await newUser.save();
    return res.status(201).json({ message: "user signup successfully " });
  } catch (error) {
    console.log("signup Error", error);
    return res.status(500).json({ error: "Error in signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email:email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    // token code ...
    const token = jwt.sign({ id: user._id }, config.JWtKey, {
      expiresIn: "1d",
    });
    const cookieOption = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };
    res.cookie("jwt", token, cookieOption);
    return res
      .status(200)
      .json({ message: "login successfully ",token});
  } catch (error) {
    console.log("Error in login", error);
    return res.status(500).json({ error: "login error" });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    if (user.otp && user.otp.expires > Date.now()) {
      const timeLeft = Math.ceil((user.otp.expires - Date.now()) / 1000);
      return res.status(401).json({ error: `Please wait ${timeLeft} seconds before requesting a new OTP.`,timeLeft });
    }
    const otp = Math.floor(10000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 2 * 60 * 1000;
    user.otp = { token: otp, expires: otpExpiry , isVerified:false};
    await user.save();
    console.log(otp, "otp");

    // mailsender function ...

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Dear ${user.name || 'User'},\n\nYour OTP for resetting your password is: ${otp}\nThis OTP is valid for 2 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nYour Company Name`

    };

    await transporter.sendMail(mailOptions);
    return res.status(201).json({ message: "OTP sent to email !" });
  } catch (error) {
    console.log("Error in forget password", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOTP = async(req, res) => {
    const {otp} = req.body;
    try {
        const user = await User.findOne({"otp.token": otp});
        if (!user) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        if(user.otp.expires < Date.now()){
            return res.status(400).json({ error: "OTP has expired" });
        }
        user.otp = undefined;
        user.otp.isVerified = true;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.log("Error in otp api", error);
        return res.status(500).json({ error: "Internal server error" });  
    }
  };

export const resetPassword = async(req, res) => {
  const {newPassword, confirmPassword} = req.body;
  try {
    const  user = await User.findOne({"otp.isVerified": true});
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (newPassword !== confirmPassword) {
      console.log("password not match");
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const newHashPassword = await bcrypt.hash(newPassword,10)
    user.password = newHashPassword;
    user.otp = undefined;
    await user.save()
    return res.status(201).json({ message: "Password Change successfully " })
  } catch (error) {
    console.log("Error in reset password api", error);
    return res.status(500).json({ error: "Internal server error" });
    
  }
  console.log("resetPassword please");
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt",{httpOnly:true,secure:true,sameSite:"strict"})
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("logOut Error", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

import express from "express"
import { forgetPassword, login, logout, resetPassword, signUP , verifyOTP } from "../controller/user.controller.js";
const router = express.Router()



router.post('/signUP', signUP)
router.post('/login', login)
router.post('/forgetPassword', forgetPassword)
router.post('/verifyOtp',verifyOTP)
router.post('/resetPassword',resetPassword)
router.post('/logout', logout)


export default router;
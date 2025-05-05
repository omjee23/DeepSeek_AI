import express from "express"
import { forgetPassword, login, logout, resetPassword, signUP } from "../controller/user.controller.js";
const router = express.Router()



router.post('/signUP', signUP)
router.post('/login', login)
router.post('/forgetPassword', forgetPassword)
router.post('/resetPassword',resetPassword)
router.post('/logout', logout)


export default router;
import express from "express";
import { signup, login, logout } from "../controller/authController.js";
import { verifyOTP, resetPassword } from "../controller/authController.js";
import { sendOTP } from "../controller/authController.js";
import { googleAuth } from "../controller/authController.js";

import dotenv from 'dotenv'
dotenv.config()

const authRouter = express.Router();

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.get("/logout", logout)

authRouter.post("/send-otp", sendOTP)
authRouter.post("/verify-otp", verifyOTP)
authRouter.post("/reset-password", resetPassword)

authRouter.post("/google-auth", googleAuth)

export default authRouter;
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()




export const signup = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        let existUser = await User.findOne({email});
        if(existUser) {
            return res.status(400).json({message: "User already exists"});
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({message: "Invalid email"});
        }

        if(password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, 
            email, 
            password: hashedPassword,
            role
        })

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days -> milliseconds
        });

        return res.status(201).json({message: "User created successfully", user, token});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body; 
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "User does not exist"});
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days -> milliseconds
        });

        return res.status(200).json({
            message: "Login successful",
            user,
            token
        });

    } catch (error) {
        res.status(500).json({ message: `Login error ${error.message}` });
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie("token")
        return res.status(200).json({message: "Logged out successfully"});

    } catch (error) {
        res.status(500).json({ message: `Logout error ${error.message}` });
    }
}

export const sendOTP = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).json({message: "User does not exist"});
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
        user.resetOtp = otp;
        user.OtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        await user.save();
        await sendMail(email, otp);
        return res.status(200).json({message: "OTP sent successfully"});
    }
    catch (error) {
        res.status(500).json({ message: `Set OTP error ${error.message}` });
    }  
}

export const verifyOTP = async (req, res) => {
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "User does not exist"});
        }

        if(user.resetOtp !== otp) {
            return res.status(400).json({message: "Invalid OTP"});
        }
        if(Date.now() > user.OtpExpiry) {
            return res.status(400).json({message: "OTP expired"});
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.OtpExpiry = undefined;
        await user.save();

        return res.status(200).json({message: "OTP verified successfully"});
    }
    catch (error) {
        res.status(500).json({ message: `Verify OTP error ${error.message}` });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {email, newPassword} = req.body;
        const user = await User.findOne({email})    

        if(!user) {
            return res.status(400).json({message: "User does not exist"});
        }

        if(!user.isOtpVerified) {
            return res.status(400).json({message: "OTP not verified"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({message: "Password reset successfully"});
    }
    catch (error) {
        res.status(500).json({ message: `Reset password error ${error.message}` });
    }    
}    


export const googleAuth = async (req, res) => {
    try {
        const {name, email, role} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            user = await User.create({
                name,
                email,
                role
            });
        }

        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days -> milliseconds
        });


        return res.status(200).json({message: "Google Auth successful", user});
    
    } catch (error) {
        res.status(500).json({ message: `Google Auth error ${error.message}` });
    }
}

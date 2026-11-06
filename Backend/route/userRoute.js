import express from "express";
import { getCurrentUser } from "../controller/userController.js";
import isAuth from "../middleware/isAuth.js";
import { updateProfile } from "../controller/userController.js";
import upload from "../middleware/multer.js";

const userRoute = express.Router();

userRoute.get("/getCurrentUser", isAuth, getCurrentUser);
userRoute.post("/profile", isAuth, upload.single("photoUrl"), updateProfile)

export default userRoute;
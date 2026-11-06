import User from "../models/user.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import fs from "fs";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: `GetCurrentUser Error: ${error.message}` });
    }
}



export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { description, name } = req.body;

        const updateData = { name, description };

        if (req.file) {
            const uploadedUrl = await uploadOnCloudinary(req.file.path); // call ONCE
            if (!uploadedUrl) {
                return res.status(500).json({ message: "Image upload failed" });
            }
            updateData.photoUrl = uploadedUrl;
        }

        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Update profile full error:", error);
        return res.status(500).json({
            message: `Update profile error: ${error.message}`,
        });
    }
};

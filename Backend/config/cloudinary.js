import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!filePath || !fs.existsSync(filePath)) {
        throw new Error(`File missing: ${filePath}`);
    }

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        console.log("Cloudinary upload successful:", uploadResult.secure_url);
        return uploadResult.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error; // don't swallow it, let the controller handle it
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

export default uploadOnCloudinary;
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // ✅ FULL DEBUG
        console.log("------ Cloudinary Config Check ------");
        console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
        console.log("API Key:", process.env.CLOUDINARY_API_KEY);
        console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);
        console.log("-------------------------------------");

    } catch (error) {
        console.error("Cloudinary Connection Error:", error);
    }
};

export default connectCloudinary;
import multer from "multer";

// ✅ Memory storage (best for Cloudinary)
const storage = multer.memoryStorage();

// ✅ Only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// ✅ Multer config
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter
});

// ✅ IMPORTANT: Named export (NOT default)
export { upload };
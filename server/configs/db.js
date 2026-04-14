import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected:", conn.connection.host);

    } catch (error) {
        console.error("❌ MongoDB ERROR:", error.message);
        process.exit(1); // stop server if DB fails
    }
};

export default connectDB;
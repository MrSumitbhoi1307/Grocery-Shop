import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { v2 as cloudinary } from "cloudinary";

const app = express();
const port = process.env.PORT || 4000;

// Database aur Cloudinary connections
await connectDB();
await connectCloudinary();

// --- 1. MIDDLEWARES (Hamesha Routes se upar honi chahiye) ---
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json()); // <--- Iska upar hona COMPULSORY hai
app.use(cookieParser());

// Debugging ke liye logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] API HIT: ${req.method} ${req.url}`);
  next();
});

// --- 2. ROUTES ---

// Test Route (Sirf check karne ke liye)
app.get('/', (req, res) => res.send("API Working"));

// Actual API Routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);

// NOTE: Ab saare order related routes 'orderRouter' ke andar hone chahiye
app.use('/api/order', orderRouter);

// Cloudinary Test
app.get("/test-cloudinary", async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(
            "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        );
        res.json(result);
    } catch (err) {
        console.error("Test Error:", err);
        res.status(500).json(err);
    }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
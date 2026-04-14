import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
    success: true,
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cartItems: user.cartItems || {}   // 🔥 MUST ADD
    }
});

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

       res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"   // ✅ FIXED (small p)
});
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// CHECK AUTH
export const isAuth = async (req, res) => {
    try {
        return res.json({
            success: true,
            user: {
                _id: req.user.id
            }
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// LOGOUT
export const logout = async (req, res) => {
    try {
        console.log("🔥 LOGOUT API HIT");

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"   // ✅ VERY IMPORTANT
        });

        return res.status(200).json({
            success: true,
            message: "Logged out"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};
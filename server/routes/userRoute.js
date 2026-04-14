import express from "express";
import { register, login, isAuth, logout } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js"; // ✅ folder name confirm: middleware

const userRouter = express.Router();

// ✅ REGISTER
userRouter.post("/register", register);

// ✅ LOGIN
userRouter.post("/login", login);

// ✅ CHECK AUTH (Protected Route)
userRouter.get("/is-auth", authUser, isAuth);

// ✅ LOGOUT (POST is better than GET)
userRouter.get("/logout", logout);

export default userRouter;
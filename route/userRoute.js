import express from "express";
import { registerUser, loginUser } from "../controller/userController.js";

const userRouter = express.Router();

// Route for user registration
userRouter.post("/register", registerUser);

// Route for user login
userRouter.post("/login", loginUser);

export default userRouter;
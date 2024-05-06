import express from "express";
import userController, { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";


const userRouter = express.Router();

userRouter.get("/test", userController);
userRouter.post("/update/:id", verifyToken, updateUser);

export default userRouter;
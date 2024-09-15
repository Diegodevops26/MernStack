import authController from "../controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", authController.loginController);

export default authRouter;
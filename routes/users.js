import express from "express";
import googleAuthController from "../api-controllers/users/googleAuth.js";
import {signupController, loginController} from "../api-controllers/users/normalAuth.js";

const router = express.Router();

router.post("/googleAuth", googleAuthController);
router.post("/signup", signupController);
router.post("/login", loginController);

export default router;
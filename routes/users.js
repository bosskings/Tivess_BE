import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import googleAuthController from "../api-controllers/users/googleAuth.js";
import {signupController, loginController,logoutController} from "../api-controllers/users/normalAuth.js";

const router = express.Router();

router.post("/googleAuth", googleAuthController);
router.post("/signup", signupController);
router.post("/login", loginController);


// Apply authMiddleware to multiple protected routes at once
router.use(authMiddleware);

    // Logout (also protected, requires a valid refresh token cookie)
    router.post("/logout", logoutController);


export default router;
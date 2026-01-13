import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import googleAuthController from "../api-controllers/users/googleAuth.js";
import {signupController, loginController,logoutController} from "../api-controllers/users/normalAuth.js";

const router = express.Router();

router.post("/googleAuth", googleAuthController);
router.post("/signup", signupController);
router.post("/login", loginController);


// controlled routes for authenticated users 



// Apply authMiddleware to multiple protected routes at once
router.use(['/settings', '/logout'], authMiddleware);

// Protected route: settings page (example)
router.get("/settings", (req, res) => {
    res.json({
        status: "SUCCESS",
        message: "This is the settings page.",
        user: req.user
    });
});

// Logout (also protected, requires a valid refresh token cookie)
router.post("/logout", logoutController);


export default router;
import express from "express";
import googleAuthController from "../api-controllers/users/googleAuth.js";
import registerController from "../api-controllers/users/normalAuth.js";

const router = express.Router();

router.post("/googleAuth", googleAuthController);
router.post("/signup", registerController);

export default router;
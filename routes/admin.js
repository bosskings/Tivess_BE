import express from "express";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import adminPreview from "../api-controllers/admin/preview.js";
import adminAuthController from "../api-controllers/admin/auth.js";
import {adminUploadVideo, adminUploadPoster, adminCheckUploadStatus} from "../api-controllers/admin/uploadContent.js";
import { getAllUsers,changeUserStatus } from "../api-controllers/admin/users.js";
// import { getActiveWatchParties } from "../api-controllers/admin/watchParty.js";
import {adminUpdatePaymentPlan, getPaymentPlans} from "../api-controllers/admin/updatePaymentPlan.js";
import multer from "multer";

const router = express.Router();

// Public – no token required
router.post("/admin-login", adminAuthController);

// Protected – require valid admin token
router.use(adminAuthMiddleware);

router.get('/admin-home', adminPreview);
router.post('/admin-uploadVideo', adminUploadVideo);

const upload = multer({ dest: "uploads/" }); // Store files on disk so file.path is available to the controller
router.post('/admin-uploadPoster', upload.single('file'), adminUploadPoster);

router.get('/admin-uploadStatus/:uid', adminCheckUploadStatus);


router.get('/admin-getPaymentPlan', getPaymentPlans);
router.patch('/admin-updatePaymentPlan', adminUpdatePaymentPlan);

// admin handle users
router.get('/admin-getUsers', getAllUsers);
router.patch('/admin-updateUsersStatus', changeUserStatus);

// router.get('/admin-watchParty', )
    

export default router;
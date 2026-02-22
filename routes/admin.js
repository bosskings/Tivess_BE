import express from "express";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";
import { adminPreview, adminRecentActivities } from "../api-controllers/admin/preview.js";
import adminAuthController from "../api-controllers/admin/auth.js";
import {adminUploadVideo, adminUploadPoster, adminMostViewedMovies} from "../api-controllers/admin/uploadContent.js";
import { getAllUsers,changeUserStatus } from "../api-controllers/admin/users.js";
// import { getActiveWatchParties } from "../api-controllers/admin/watchParty.js";
import {adminUpdatePaymentPlan, getPaymentPlans} from "../api-controllers/admin/updatePaymentPlan.js";
import { getActiveWatchParties } from "../api-controllers/admin/watchParty.js";
import multer from "multer";

const router = express.Router();

// Public – no token required
router.post("/admin-login", adminAuthController);

// Protected – require valid admin token
router.use(adminAuthMiddleware);

router.get('/admin-home', adminPreview);
router.get('/admin-getTopContent', adminMostViewedMovies);
router.post('/admin-uploadVideo', adminUploadVideo);
router.get('/admin-recentActivities', adminRecentActivities);

const upload = multer({ dest: "uploads/" }); // Store files on disk so file.path is available to the controller
router.post('/admin-uploadPoster', upload.single('file'), adminUploadPoster);


router.get('/admin-getPaymentPlan', getPaymentPlans);
router.patch('/admin-updatePaymentPlan', adminUpdatePaymentPlan);

// admin handle users
router.get('/admin-getUsers', getAllUsers);
router.patch('/admin-updateUsersStatus', changeUserStatus);

// watch party section.
router.get('/admin-watchParty', getActiveWatchParties )
    

export default router;
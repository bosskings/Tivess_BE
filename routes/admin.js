import express from "express";
import adminPreview from "../api-controllers/admin/preview.js";
import adminUploadContent from "../api-controllers/admin/uploadContent.js";
import { getAllUsers,changeUserStatus } from "../api-controllers/admin/users.js";
import { getActiveWatchParties } from "../api-controllers/admin/watchParty.js";
import adminUpdatePaymentPlan from "../api-controllers/admin/updatePaymentPlan.js";

const router = express.Router();


    router.get('/admin-home', adminPreview);
    router.post('/admin-uploadContent', adminUploadContent);
    router.get('/admin-uploadStatus/:uid', adminUploadContent);


    router.get('/admin-getPaymentPlan', getPaymentPlan);
    router.patch('/admin-updatePaymentPlan', adminUpdatePaymentPlan);

    // admin handle users
    router.get('/admin-getUsers', getAllUsers);
    router.patch('/admin-updateUsers', changeUserStatus);

    // router.get('/admin-watchParty', )
    

export default router;
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const authMiddleware = async (req, res, next) => {

    console.log("calling auth middleware");

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ status:"FAILED", message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ status:"FAILED", message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ status:"FAILED", message: "Unauthorized" });
    }

    req.user = user;
    next();
};

export default authMiddleware;
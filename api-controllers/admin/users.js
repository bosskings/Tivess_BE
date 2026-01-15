import User from "../../models/User.js";

/**
 * Controller to get all users.
 * Sends a list of all users in the User model.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: "SUCCESS", data: users });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: "Server error.", error: error.message });
    }
};

/**
 * Controller to change the status of a user (suspend/unsuspend).
 * Expects req.body: { userId, status } where status can be 'suspended' or 'active'
 */
const changeUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ status: "FAILED", message: "userId and status are required." });
        }

        if (!["suspended", "active"].includes(status)) {
            return res.status(400).json({ status: "FAILED", message: "Status must be 'suspended' or 'active'." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "FAILED", message: "User not found." });
        }

        user.status = status;
        await user.save();

        res.status(200).json({ status: "SUCCESS", message: `User status changed to ${status}.`, data: user });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: "Server error.", error: error.message });
    }
};

export {
    getAllUsers,
    changeUserStatus
}

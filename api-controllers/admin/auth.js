import { generateAdminAccessToken } from "../../utils/auth.utils.js";

// Hardcoded admin credentials – replace in production!
const ADMIN_LOGIN_ID = "admin001@tivess.media";
const ADMIN_PASSWORD = "Tivess#Tripp123.";

// Admin login route
const adminAuthController = async (req, res) => {
  const { loginId, password } = req.body;

  if (loginId !== ADMIN_LOGIN_ID || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      status: "FAILED",
      message: "Invalid Login ID or Password",
    });
  }

  // Credentials matched, generate token
  const token = generateAdminAccessToken({ loginId: ADMIN_LOGIN_ID });

  return res.status(200).json({
    status: "SUCCESS",
    message: "Admin login successful.",
    token,
  });
};

export default adminAuthController;
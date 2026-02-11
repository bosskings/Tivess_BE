import { generateAdminAccessToken } from "../../utils/auth.utils.js";

// Admin login route
const adminAuthController = async (req, res) => {
  
  const ADMIN_LOGIN_ID = process.env.ADMIN_LOGIN_ID;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const { loginId, password } = req.body;

  if (loginId !== ADMIN_LOGIN_ID || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      status: "FAILED",
      message: "Invalid Login ID or Password",
      data:{
        loginId: ADMIN_LOGIN_ID,
        password: ADMIN_PASSWORD
      }
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
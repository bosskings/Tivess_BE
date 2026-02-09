import jwt from "jsonwebtoken";

/**
 * Verifies Bearer token and ensures payload has type "ADMIN".
 * Use on all admin routes except login.
 */
const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      status: "FAILED",
      message: "Authorization required. Provide a valid admin token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "ADMIN") {
      return res.status(403).json({
        status: "FAILED",
        message: "Access denied. Admin token required.",
      });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "FAILED",
      message: "Invalid or expired admin token.",
    });
  }
};

export default adminAuthMiddleware;

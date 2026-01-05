import { OAuth2Client } from "google-auth-library";
import User from "../../models/User.js";

// Replace this with your own Google client ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Google sign-up/login handler
const googleAuthController = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new Error("Token is required. Please provide a valid token.");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Extract needed info
    const { email, name, sub, picture } = payload;

    if (!email) {
      throw new Error("Invalid Google token. No email found.");
    }

    // Check if user exists in DB
    let user = User.findOne({ email: email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        email,
        name,
        picture,
        provider: "google",
        googleId: sub,
      });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );

    res.status(200).json({ 
      status:"SUCCESS", 
        message: "Authenticated with Google.", 
        user, token 
      });
 
  } catch (err) {
    return res.status(401).json({ 
      status:"FAILED", 
      message: "Invalid Google token.", 
      error: err.message
    });
  }
};

export default googleAuthController;

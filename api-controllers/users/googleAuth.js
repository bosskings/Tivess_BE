import { OAuth2Client } from "google-auth-library";
import express from "express";

const router = express.Router();

// Replace this with your own Google client ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

// Dummy user database, replace with your database logic
const users = new Map(); // Map<email, user object>

// Google sign-up/login handler
router.post("/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
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
      return res.status(400).json({ message: "Invalid Google token." });
    }

    // Check if user exists in DB (Replace this logic with your own)
    let user = users.get(email);

    if (!user) {
      // Signup flow - register new user
      user = {
        id: sub, // or generate your own user ID
        email,
        name,
        picture,
        provider: "google",
        // any other fields
      };
      users.set(email, user);
      // You might want to save to your actual DB here
    }

    // Issue your own session/token for the user if needed (e.g. JWT)
    // Here, simply returning the user object for demonstration
    res.status(200).json({ user, message: "Authenticated with Google." });
  } catch (err) {
    return res.status(401).json({ message: "Invalid Google token.", error: err.message });
  }
});

export default router;

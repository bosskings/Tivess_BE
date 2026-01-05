import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const registerController = async (req, res) => {
    const { name, email, phone, password } = req.body;

    // Ensure all required fields are present
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ status: "FAILED", message: "Please provide name, email, phone, and password." });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
        // Authenticate: compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "FAILED", message: "Invalid credentials." });
        }
        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        return res.status(200).json({
            status: "SUCCESS",
            message: "Authentication successful.",
            user,
            token
        });
    } else {
        // Register new user
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            provider: "local"
        });
        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        return res.status(201).json({
            status: "SUCCESS",
            message: "User registered successfully.",
            user,
            token
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "FAILED", message: "Please provide email and password." });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ status: "FAILED", message: "Invalid credentials." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "FAILED", message: "Invalid credentials." });
        }

        // Issue JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            status: "SUCCESS",
            message: "Login successful.",
            user,
            token
        });
    } catch (err) {
        return res.status(500).json({ status: "FAILED", message: "Server error.", error: err.message });
    }
};


export default registerController;
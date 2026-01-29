import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import RefreshToken from "../../models/RefreshToken.js";
import sendEmail from "../../utils/sendMails.utils.js";

import {comparePassword,
    generateRandomToken,
    generateAccessToken,
    addDays,
    hashToken} from "../../utils/auth.utils.js"

const signupController = async (req, res) => {
    try {
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
            // const token = jwt.sign(
            //     { id: user._id, type:"USER" },
            //     process.env.JWT_SECRET,
            //     { expiresIn: "24h" }
            // );
            return res.status(200).json({
                status: "SUCCESS",
                message: "Authentication successful.",
                user
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

            // send email
            const result =  await sendEmail(email, "Signup was successful", "SignUp");

            if (!result.success) {
                console.log(result);
                return res.status(500).json({ message: "Email failed" });
            }

            return res.status(201).json({
                status: "SUCCESS",
                message: "User registered successfully.",
                user,
                token
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "FAILED", message: "An error occurred "+error });
    }
};


/**
 * POST /auth/login
 */
const loginController = async (req, res) => {
    const { email, password, remember_me } = req.body

    const user = await User.findOne({ email })
    if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const validPassword = await comparePassword(password, user.password)
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken(user.id)

    const refreshToken = generateRandomToken()
    const refreshTokenHash = hashToken(refreshToken)

    const days = remember_me
        ? Number(30)
        : Number(1)

    await RefreshToken.create({
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: addDays(days),
        deviceInfo: req.headers['user-agent']
    })

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: days * 24 * 60 * 60 * 1000
    })

    // send login success email
    

    res
    .status(200)
    .header("auth-token", accessToken)
    .json({ 
        status:"SUCCESS",
        message:"login success",
        token:accessToken,
        data: user
    });
}



/**
 * POST /auth/refresh
 */
const refreshController = async (req, res) => {
    const token = req.cookies.refresh_token
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const tokenHash = hashToken(token)

    const storedToken = await RefreshToken.findOne({
        tokenHash,
        revoked: false,
        expiresAt: { $gt: new Date() }
    })

    if (!storedToken) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    // ROTATION
    storedToken.revoked = true
    await storedToken.save()

    const newRefreshToken = generateRandomToken()
    const newRefreshTokenHash = hashToken(newRefreshToken)

    await RefreshToken.create({
        userId: storedToken.userId,
        tokenHash: newRefreshTokenHash,
        expiresAt: storedToken.expiresAt,
        deviceInfo: storedToken.deviceInfo
    })

    const accessToken = generateAccessToken(storedToken.userId)

    res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })

    res.json({ accessToken })
}




/**
 * POST /auth/logout
 */
const logoutController = async (req, res) => {
    const token = req.cookies.refresh_token

    if (token) {
        const tokenHash = hashToken(token)
        await RefreshToken.updateOne(
        { tokenHash },
        { revoked: true }
        )
    }

    res.clearCookie('refresh_token')
    res.json({ message: 'Logged out' })
}



export  {signupController,loginController, refreshController, logoutController};
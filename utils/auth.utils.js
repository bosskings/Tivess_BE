import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken"

const hashPassword = password => bcrypt.hash(password, 12)
const comparePassword = (password, hash) => bcrypt.compare(password, hash)

// for crypto tokens
const generateRandomToken = () =>
  crypto.randomBytes(64).toString('hex')

const hashToken = token =>
  crypto.createHash('sha256').update(token).digest('hex')


// for Date
const addDays = days =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000)


// JWT Token creation

const generateAccessToken = userId =>
    jwt.sign(
      { sub: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    )
  
  const verifyAccessToken = token =>
    jwt.verify(token, process.env.JWT_SECRET)



export {
    hashPassword,
    comparePassword,
    generateRandomToken,
    hashToken,
    addDays,
    generateAccessToken,
    verifyAccessToken
};
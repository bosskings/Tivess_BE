import mongoose from "mongoose";


const RefreshTokenSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    tokenHash: {
        type: String,
        index: true,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revoked: {
        type: Boolean,
        default: false
    },
    deviceInfo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
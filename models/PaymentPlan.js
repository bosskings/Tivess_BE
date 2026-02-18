import mongoose from "mongoose";

const paymentPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'REGULAR'
    },
    price: {
        type: Number,
        required: true
    },
    durationInDays: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        default: [
            "HD streaming",
            "No ads",
            "Access to all movies"
        ],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentPlan = mongoose.model("PaymentPlan", paymentPlanSchema);

export default PaymentPlan;


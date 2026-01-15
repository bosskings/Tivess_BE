import mongoose from "mongoose";

const paymentPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    durationInDays: {
        type: Number,
        required: true
    },
    features: [
        {
            type: String
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentPlan = mongoose.model("PaymentPlan", paymentPlanSchema);

export default PaymentPlan;


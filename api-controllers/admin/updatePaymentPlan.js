import PaymentPlan from "../../models/PaymentPlan.js";

/**
 * Controller to get all current Payment Plans.
 */
const getPaymentPlans = async (req, res) => {
    try {
        const plans = await PaymentPlan.find();
        res.status(200).json({ status: "SUCCESS", data: plans });
    } catch (error) {
        res.status(500).json({ status: "FAILED", message: "Server error.", error: error.message });
    }
};

/**
 * Controller to update a PaymentPlan.
 * Expects req.body to contain: { planId, amount, name, description, ... }
 */
const adminUpdatePaymentPlan = async (req, res) => {
    try {
        const { planId, amount, name, description } = req.body;

        if (!planId) {
            return res.status(400).json({ message: "planId is required." });
        }

        // Fetch the payment plan first to ensure it exists
        const existingPlan = await PaymentPlan.findById(planId);
        if (!existingPlan) {
            return res.status(404).json({ message: "Payment Plan not found." });
        }

        // Build update object only with valid fields
        const updateFields = {};
        if (amount !== undefined) updateFields.amount = amount;
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields provided to update." });
        }

        // Update the payment plan
        Object.assign(existingPlan, updateFields);
        const updatedPlan = await existingPlan.save();

        res.status(200).json({ status:"SUCCESS", message: "Payment Plan updated successfully.", data: updatedPlan });
    } catch (error) {
        res.status(500).json({ status:"FAILED", message: "Server error. ".error.message });
    }
};

export { 
    getPaymentPlans, 
    adminUpdatePaymentPlan 
};

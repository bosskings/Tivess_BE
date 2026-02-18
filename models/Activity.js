import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    activityType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SEEN", "UNSEEN"],
      default: "UNSEEN",
    },
    comment: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;

import mongoose from "mongoose";

const WatchPartySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    movieLink: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "ended"],
      default: "scheduled",
    }
  },
  { timestamps: true }
);

const WatchParty = mongoose.model("WatchParty", WatchPartySchema);

export default WatchParty;

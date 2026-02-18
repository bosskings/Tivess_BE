import mongoose from "mongoose";

const WatchPartySchema = new mongoose.Schema(
  {
    host: {
      type:String,
      // type: mongoose.Schema.Types.ObjectId,
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
      default:"https://www.youtube.com/watch?v=Juj0fBbcdd4"
    },
    participants: [
      {
        type:String,
        // type: mongoose.Schema.Types.ObjectId,
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

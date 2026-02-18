import mongoose from "mongoose";

const WatchPartySchema = new mongoose.Schema(
  {
    host: {
      type:String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      required: true,
      default:"6991039eda5fbc8cfc85c205"
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
        // ref: "User",
        default:'0'
      },
    ],
    
    status: {
      type: String,
      enum: ["SCHEDULED", "ONGOING", "ENDED"],
      default: "scheduled",
    }
  },
  { timestamps: true }
);

const WatchParty = mongoose.model("WatchParty", WatchPartySchema);

export default WatchParty;

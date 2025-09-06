import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    eventRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "eventModel",
      required: true,
    },

    eventModel: {
      type: String,
      enum: ["Event", "SubEvent"], 
      required: true,
    },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],


    joinCode: {
      type: String,
      unique: true,
      index: true,
    },


    registeredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);



const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;

import mongoose from "mongoose";
import Team from '@/models/teamModel.js'
import SubEvent from '@/models/subEventModel.js'
import Event from '@/models/eventModel.js'
import Institute from '@/models/instituteModel.js'
import Registration from "@/models/registrationModel.js"

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required:false,
      select: false, 
    },

    authProvider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },

    profilePicture: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    },

    instituteName: {
      type: String,
      trim: true,
    },

    instituteRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },

    coordinatorFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        default: [],
      },
    ],

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: [],
      },
    ],

participation: [
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "participation.itemType", 
    },
    itemType: {
      type: String,
      enum: ["Event", "SubEvent"],
      required: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", 
    },
  },
],


    IdProof: {
      type: String,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyToken: {
      type: String,
    },

    verifyTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    profilePicture: {
        type: String,
        default: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    },
    instituteName: {
        type: String,
        trim: true,
    },
    instituteRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institute",
    },
    coordinatorFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }],
    participation: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubEvent"
    }],
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
    }
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
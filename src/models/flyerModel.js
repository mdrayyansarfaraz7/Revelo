import mongoose from "mongoose";
import Event from '@/models/eventModel.js'
import User from '@/models/userModel.js'

const flyerSchema = new mongoose.Schema({
    imgUrl: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },

    orientation: {
        type: String,
        enum: ["portrait", "landscape",],
        default: "portrait",
    },

    width: { type: Number },
    height: { type: Number },

    aspectRatio: { type: String },

    displayType: {
        type: String,
        enum: ["scroll", "advertisement", "banner", "thumbnail"],
         default: "scroll",
    },


    views: { type: Number, default: 0 },

    tags: [String],
    categories: [String],

    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    likesCount: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true });

flyerSchema.pre("save", function (next) {
  if (this.width && this.height && !this.aspectRatio) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const w = this.width;
    const h = this.height;
    const divisor = gcd(w, h);
    this.aspectRatio = `${w / divisor}:${h / divisor}`;
  }
});

const Flyer = mongoose.models.Flyer || mongoose.model("Flyer", flyerSchema);
export default Flyer;

import mongoose from "mongoose";
mongoose.set('autoIndex', false);

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
    enum: ["portrait", "landscape"],
    default: "portrait",
  },
  width: { type: Number },
  height: { type: Number },
  aspectRatio: { type: String },
  displayType: {
    type: String,
    enum: ["scroll", "advertisement"],
    default: "scroll",
  },
  views: { type: Number, default: 0 },
  tags: [String],
  categories: [String],
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { timestamps: true });

const Flyer = mongoose.models.Flyer || mongoose.model("Flyer", flyerSchema);
export default Flyer;

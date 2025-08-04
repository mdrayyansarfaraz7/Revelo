import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    videoType: {
        type: String,
        enum: ["reel", "highlight"],
        required: true,
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    tags: [{ type: String }],
    categories: [{ type: String }],
}, {
    timestamps: true,
});


const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;

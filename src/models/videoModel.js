import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    }
},{
    timestamps: true
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
export default Video;
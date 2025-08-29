import { NextResponse } from "next/server";
import Video from "@/models/videoModel";

export async function POST(req, { params }) {
    try {
        const { userId } = await req.json();
        const video = await Video.findById(params.id);

        if (!video) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const alreadyLiked = video.likedBy.includes(userId);

        if (alreadyLiked) {
            video.likedBy.pull(userId);
            video.likesCount = Math.max(0, video.likesCount - 1);
        } else {
            video.likedBy.push(userId);
            video.likesCount += 1;
        }
        await video.save();
        return NextResponse.json(video);

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to toggle like", details: err.message },
            { status: 500 }
        );
    }
}
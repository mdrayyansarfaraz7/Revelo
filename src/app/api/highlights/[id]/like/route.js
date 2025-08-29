import { NextResponse } from "next/server";
import Video from "@/models/videoModel";

export async function PATCH(req, { params }) {
    try {


        const { userId } = await req.json();


        const video = await Video.findById(params.id);

        if (!video) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const alreadyLiked = video.likedBy.includes(userId);

        if (alreadyLiked) {
            video.likedBy.pull(userId);
        } else {
            video.likedBy.push(userId);
        }

        // ✅ Always derive likes count from likedBy length
        video.likes = video.likedBy.length;

        await video.save();


        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to toggle like", details: error.message },
            { status: 500 }
        );
    }
}

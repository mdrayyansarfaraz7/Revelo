import { NextResponse } from "next/server";
import Video from "../../../../models/videoModel";
import dbConnect from '@/lib/dbConnect';
import Event from "@/models/eventModel";

export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const {
        videoUrl,
        description,
        thumbnailUrl,
        eventId,
        videoType,
        tags,
        categories
    } = body;
    console.log(body);
    const ALLOWED_VIDEO_TYPES = ["reel", "highlight"];

    if (!ALLOWED_VIDEO_TYPES.includes(videoType)) {
        return NextResponse.json(
            { message: "videoType must be 'reel' or 'longVideo'" },
            { status: 400 }
        );
    }
    if (!videoUrl || !description || !thumbnailUrl || !eventId || !videoType || !Array.isArray(tags) || !Array.isArray(categories)) {
        return NextResponse.json({ message: "Required fields missing or malformed" }, { status: 400 });
    }
    const event = await Event.findById(eventId);

    if (!event) {
        return NextResponse.json({ message: "Event not found for given ID" }, { status: 404 });
    }

    try {
        const newVideo = await new Video({
            videoUrl,
            description,
            thumbnailUrl,
            eventId,
            videoType,
            tags,
            categories
        });
        await newVideo.save();

        await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { videos: newVideo._id } },
            { new: true }
        );

        return NextResponse.json(
            { message: "Successfully added the video", newVideo },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ message: msg, error: err.message }, { status: 500 });
    }
}

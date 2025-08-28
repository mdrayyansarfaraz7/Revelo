import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/videoModel.js";
import Event from "@/models/eventModel.js";

export async function GET(req) {
  try {
    await dbConnect();
    const now = new Date();

    // 1️⃣ Find all highlight videos
    const allHighlights = await Video.find({ videoType: "highlight" })
      .populate("eventId", "registrationStarts registrationEnds title")
      .lean();

    const liveOrUpcoming = [];
    const others = [];

    allHighlights.forEach((video) => {
      const ev = video.eventId;
      if (!ev) {
        others.push(video);
        return;
      }

      if (
        (ev.registrationStarts <= now && ev.registrationEnds >= now) || // live now
        ev.registrationStarts > now // upcoming
      ) {
        liveOrUpcoming.push(video);
      } else {
        others.push(video);
      }
    });


    const orderedHighlights = [...liveOrUpcoming, ...others];

    return NextResponse.json({ highlights: orderedHighlights }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in Sending ALL highlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
      { status: 500 }
    );
  }
}

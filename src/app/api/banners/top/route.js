import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Flyer from "@/models/flyerModel";
import Event from "@/models/eventModel";

export async function GET() {
  await dbConnect();

  try {
    const now = new Date();

    // STEP 1: Find all landscape advertisement banners
    const allLandscapeBanners = await Flyer.find({
      displayType: "advertisement",
      orientation: "landscape",
    }).sort({ createdAt: -1 });

    console.log("✅ All landscape banners found:", allLandscapeBanners.length);

    if (!allLandscapeBanners.length) {
      return NextResponse.json({ banners: [] }, { status: 200 });
    }

    // STEP 2: Extract event IDs
    const eventIds = allLandscapeBanners.map(b => b.eventId);
    console.log("📌 Event IDs from banners:", eventIds);

    // STEP 3: Find live events from those IDs
    const liveEvents = await Event.find({
      _id: { $in: eventIds },
      registrationStarts: { $lte: now },
      registrationEnds: { $gte: now },
    }).select("_id registrationStarts registrationEnds");

    console.log("🔥 Live events found:", liveEvents.length);

    if (!liveEvents.length) {
      return NextResponse.json({ banners: [] }, { status: 200 });
    }

    const liveEventIds = liveEvents.map(e => e._id.toString());
    console.log("🎯 Live Event IDs:", liveEventIds);

    // STEP 4: Filter only banners for those live events
    const banners = allLandscapeBanners.filter(b =>
      liveEventIds.includes(b.eventId.toString())
    );

    console.log("🎉 Final banners to show:", banners.length);

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("❌ Error in GET /banners:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




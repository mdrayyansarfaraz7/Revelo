import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();

    // Top 10 events sorted by views only
    const trendingEvents = await Event.find({})
      .sort({ "stats.views": -1 }) 
      .limit(10)
      .populate("subEvents")

    return NextResponse.json({ events: trendingEvents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trending events:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

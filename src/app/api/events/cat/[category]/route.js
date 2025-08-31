import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import dbConnect from "@/lib/dbConnect";

const allowedCategories = [
  "Cultural Fest",
  "Tech Fest",
  "Hackathon",
  "Ideathon",
  "Workshop",
  "Sports",
  "Concerts",
  "E-Submits",
  "Carnival",
  "Contest"
];

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { category } = params;

    const decodedCategory = decodeURIComponent(category);

    if (!allowedCategories.includes(decodedCategory)) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Live events
    const liveEvents = await Event.find({
      category: decodedCategory,
      registrationStarts: { $lte: now },
      registrationEnds: { $gte: now },
    })
      .populate("subEvents")
      .sort({ "duration.0": 1 });

    // Upcoming events
    const upcomingEvents = await Event.find({
      category: decodedCategory,
      registrationStarts: { $gt: now },
    })
      .populate("subEvents")
      .sort({ registrationStarts: 1 });

    // Past events
    const pastEvents = await Event.find({
      category: decodedCategory,
      registrationEnds: { $lt: now },
    })
      .populate("subEvents")
      .sort({ registrationEnds: -1 });

    const events = [...liveEvents, ...upcomingEvents, ...pastEvents];

    return NextResponse.json({ events }, { status: 200 });

  } catch (error) {
    console.error("Error fetching events by category:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

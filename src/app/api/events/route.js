import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import dbConnect from "@/lib/dbConnect"; // assuming you have a connection util


export async function GET(req) {
  try {
    await dbConnect();

    const now = new Date();

    const liveEvents = await Event.find({
      registrationStarts: { $lte: now },
      registrationEnds: { $gte: now }
    })
      .populate("subEvents") 
      .sort({ "duration.0": 1 }); 

    const upcomingEvents = await Event.find({
      registrationStarts: { $gt: now }
    })
      .populate("subEvents")
      .sort({ registrationStarts: 1 });

    const pastEvents = await Event.find({
      registrationEnds: { $lt: now }
    })
      .populate("subEvents")
      .sort({ registrationEnds: -1 });

    const events = [...liveEvents, ...upcomingEvents, ...pastEvents];

    return NextResponse.json({ events }, { status: 200 });

  } catch (error) {
    console.log("Error occurred while fetching events: ", error);
    return NextResponse.json(
      { message: "Cannot retrieve events data from DB", error: error.message },
      { status: 500 }
    );
  }
}

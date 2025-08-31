import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $inc: { "stats.views": 1 } },
      { new: true }
    ).select("stats.views");

    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { eventId: id, views: updatedEvent.stats.views },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating views:", error);
    return NextResponse.json(
      { message: "Something went wrong while updating views", error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";
import Coordinator from "@/models/userModel";
import Flyer from "@/models/flyerModel";
import Video from "@/models/videoModel";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    await dbConnect();

    const id = context?.params?.id;

    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 });
    }

    const event = await Event.findById(id)
      .populate("subEvents")
      .populate("coordinators")
      .populate("flyers")
      .populate("videos");

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const body = await req.json();
    const updateData = {};

    if (body.description !== undefined) updateData.description = body.description;

    if (Array.isArray(body.duration) && body.duration.length === 2) {
      updateData.duration = [
        new Date(body.duration[0]),
        new Date(body.duration[1])
      ];
    }

    if (body.registrationStarts !== undefined) {
      updateData.registrationStarts = new Date(body.registrationStarts);
    }

    if (body.registrationEnds !== undefined) {
      updateData.registrationEnds = new Date(body.registrationEnds);
    }

    if (body.isTicketed !== undefined) updateData.isTicketed = body.isTicketed;
    if (body.allowDirectRegistration !== undefined)
      updateData.allowDirectRegistration = body.allowDirectRegistration;
    if (body.ticketPrice !== undefined) updateData.ticketPrice = body.ticketPrice;
    if (body.registrationFee !== undefined) updateData.registrationFee = body.registrationFee;
    if (body.teamRequired !== undefined) updateData.teamRequired = body.teamRequired;
    if (body.teamSize !== undefined) updateData.teamSize = body.teamSize;
    if (body.rules !== undefined) updateData.rules = body.rules;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;

    // Update and validate
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });

  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import Event from "@/models/eventModel";
import Flyer from '@/models/flyerModel.js';

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const {
    eventId,
    flyerUrl,
    description,
    orientation,
    width,
    height,
    displayType,
    tags,
    categories,
  } = body;

  if (
    !eventId ||
    !flyerUrl ||
    !description ||
    !orientation ||
    width == null ||
    height == null ||
    !displayType ||
    !Array.isArray(tags) ||
    !Array.isArray(categories)
  ) {
    return NextResponse.json({ message: "Required fields missing or malformed" }, { status: 400 });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return NextResponse.json({ message: "Event not found for given ID" }, { status: 404 });
  }

  try {
    const newFlyer = new Flyer({
      imgUrl: flyerUrl,
      description,
      eventId,
      orientation,
      width,
      height,
      displayType,
      tags,
      categories,
    });
    await newFlyer.save();
    
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { flyers: newFlyer._id } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Successfully created the flyer", flyer: newFlyer },
      { status: 201 }
    );
  } catch (err) {
 
    const msg = err.code === 11000 ? "Flyer with this image URL already exists" : "Server error";
    return NextResponse.json({ message: msg, error: err.message }, { status: 500 });
  }
}

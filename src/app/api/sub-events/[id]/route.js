import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubEvent from "@/models/subEventModel"; 

export async function GET(req, { params }) {
  const { id } = params;

  await dbConnect();

  try {
    const subevent = await SubEvent.findById(id);

    if (!subevent) {
      return NextResponse.json(
        { message: "No sub-event found with the provided ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Success", subevent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sub-event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json(); 

    const updatedSubEvent = await SubEvent.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedSubEvent) {
      return NextResponse.json(
        { success: false, message: "Sub-event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedSubEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /sub-events/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

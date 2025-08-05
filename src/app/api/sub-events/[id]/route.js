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

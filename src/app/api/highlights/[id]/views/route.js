import { NextResponse } from "next/server";
import Video from "@/models/videoModel";

export async function PATCH(req, { params }) {
  try {
    const video = await Video.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return NextResponse.json(
        { message: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating video views", error: error.message },
      { status: 500 }
    );
  }
}

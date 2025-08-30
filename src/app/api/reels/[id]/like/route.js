import Video from "@/models/videoModel.js";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { userId } = await req.json();

    // Await the findById call
    const reel = await Video.findById(params.id);

    if (!reel) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Toggle like
    const alreadyLiked = reel.likedBy.includes(userId);
    if (alreadyLiked) {
      reel.likedBy.pull(userId);
    } else {
      reel.likedBy.push(userId);
    }

    reel.likes = reel.likedBy.length;

    await reel.save();

    return NextResponse.json(reel, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to toggle like", details: err.message },
      { status: 500 }
    );
  }
}

import Flyer from "@/models/flyerModel";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { userId } = await req.json();
    const flyer = await Flyer.findById(params.id);

    if (!flyer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const alreadyLiked = flyer.likedBy.includes(userId);

    if (alreadyLiked) {
      flyer.likedBy.pull(userId);
      flyer.likesCount = Math.max(0, flyer.likesCount - 1);
    } else {
      flyer.likedBy.push(userId);
      flyer.likesCount += 1;
    }

    await flyer.save();

    return NextResponse.json(flyer);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to toggle like", details: err.message },
      { status: 500 }
    );
  }
}
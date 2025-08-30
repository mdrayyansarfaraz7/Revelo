// app/api/reels/route.js
import { NextResponse } from "next/server";
import Video from "@/models/videoModel.js";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const tags = searchParams.get("tags");       
    const categories = searchParams.get("categories"); 

    const filter = { videoType: "reel" };

    if (tags) filter.tags = { $in: tags.split(",") };
    if (categories) filter.categories = { $in: categories.split(",") };

    const reels = await Video.find(filter)
      .sort({ views: -1 }) 

    return NextResponse.json(reels, { status: 200 });
  } catch (error) {
    console.error("Error fetching reels:", error);
    return NextResponse.json(
      { error: "Failed to fetch reels" },
      { status: 500 }
    );
  }
}

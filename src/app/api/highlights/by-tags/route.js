import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/videoModel.js";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const tagsParam = searchParams.get("tags");

    if (!tagsParam) {
      return NextResponse.json(
        { error: "Tags query parameter is required" },
        { status: 400 }
      );
    }

    const tags = tagsParam.split(",").map((t) => t.trim());

    const highlights = await Video.find({
      videoType: "highlight",
      tags: { $in: tags }, 
    }).lean();

    return NextResponse.json({ highlights }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in fetching highlights by tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
      { status: 500 }
    );
  }
}

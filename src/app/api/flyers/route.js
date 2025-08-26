// /api/flyers/route.js
import Flyer from "@/models/flyerModel.js";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orientation = searchParams.get("orientation");

    const query = {};
    if (orientation) query.orientation = orientation;

    const flyers = await Flyer.find(query)
      .populate("eventId", "title date") 
      .sort({ createdAt: -1 }); 

    return NextResponse.json(flyers);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch flyers", details: err.message },
      { status: 500 }
    );
  }
}

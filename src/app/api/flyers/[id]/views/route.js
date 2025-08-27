import Flyer from "@/models/flyerModel";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const flyer = await Flyer.findByIdAndUpdate(
      params.id,
      { $inc: { views: 1 } },   
      { new: true }             
    );

    if (!flyer) {
      return NextResponse.json({ error: "Flyer not found" }, { status: 404 });
    }

    return NextResponse.json(flyer);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to increment view", details: err.message },
      { status: 500 }
    );
  }
}
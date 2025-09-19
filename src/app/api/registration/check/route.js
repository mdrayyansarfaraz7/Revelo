// app/api/registration/check/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/registrationModel";

export async function GET(req) {
  await dbConnect();
  console.log("Connected to DB for registration check");

  try {
    const { searchParams } = new URL(req.url);

    const eventId = searchParams.get("eventId");      // optional
    const subEventId = searchParams.get("subEventId"); // optional
    const teamId = searchParams.get("teamId");       // optional
    const userId = searchParams.get("userId");       // optional

    console.log("Received params:", { eventId, subEventId, teamId, userId });

    if (!eventId && !subEventId) {
      console.warn("Missing eventId and subEventId");
      return NextResponse.json(
        { error: "Either eventId or subEventId is required" },
        { status: 400 }
      );
    }

    if (!teamId && !userId) {
      console.warn("Missing teamId and userId");
      return NextResponse.json(
        { error: "Either teamId or userId must be provided" },
        { status: 400 }
      );
    }

    // Build query dynamically
    const query = {};
    if (eventId) query.eventId = eventId;
    if (subEventId) query.subEventId = subEventId;
    if (teamId) query.team = teamId;
    if (!teamId && userId) query.registeredBy = userId;

    console.log("Constructed query:", query);

    const exists = await Registration.findOne(query);
    console.log("Registration found:", exists);

    return NextResponse.json({ registered: !!exists });
  } catch (err) {
    console.error("Check registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

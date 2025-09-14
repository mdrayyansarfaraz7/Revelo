import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Team from "@/models/teamModel";
import User from "@/models/userModel";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";

export async function POST(req) {
  try {
    console.log("📌 Incoming team verification request");

    await dbConnect();
    console.log("✅ Database connected");

    const { joiningCode, eventId, subEventId, eventModel } = await req.json();
    console.log("➡️ Request body:", { joiningCode, eventId, subEventId, eventModel });

    if (!joiningCode || !eventModel) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { error: "Joining code and Event Model are required" },
        { status: 400 }
      );
    }

    // Pick the correct reference ID
    const refId = eventModel === "Event" ? eventId : subEventId;
    if (!refId) {
      console.warn("⚠️ Missing Event/SubEvent ID");
      return NextResponse.json(
        { error: `${eventModel} ID is required` },
        { status: 400 }
      );
    }

    console.log("🔍 Finding team with:", { joiningCode, refId, eventModel });

    // Find the team
    const team = await Team.findOne({
      joinCode: joiningCode,
      eventRef: refId,
      eventModel, // "Event" | "SubEvent"
    }).populate({
      path: "members",
      select: "username profilePicture fullName email",
    });

    console.log("📊 Team query result:", team ? "FOUND ✅" : "NOT FOUND ❌");

    if (!team) {
      return NextResponse.json(
        { error: `Team not found for this ${eventModel}` },
        { status: 404 }
      );
    }

    // Fetch the event/subevent to get team size criteria
    let eventDoc = null;

    if (eventModel === "SubEvent") {
      console.log("🔎 Fetching SubEvent:", refId);
      eventDoc = await SubEvent.findById(refId);
    } else if (eventModel === "Event") {
      console.log("🔎 Fetching Event:", refId);
      eventDoc = await Event.findById(refId);
    }

    console.log("📊 Event query result:", eventDoc ? "FOUND ✅" : "NOT FOUND ❌");

    if (!eventDoc) {
      return NextResponse.json(
        { error: `${eventModel} not found` },
        { status: 404 }
      );
    }

    const minTeamSize = eventDoc.teamSize?.min;
    const maxTeamSize = eventDoc.teamSize?.max;
    const totalMembers = team.members.length;

    console.log("📏 Team size criteria → Min:", minTeamSize, "Max:", maxTeamSize);
    console.log("👥 Current team members count:", totalMembers);

    if (totalMembers < minTeamSize || totalMembers > maxTeamSize) {
      console.warn("⚠️ Team does not meet size requirements");
      return NextResponse.json(
        { error: "Team is not complete or invalid size" },
        { status: 400 }
      );
    }

    // Populate leader info
    await team.populate({
      path: "leader",
      select: "username profilePicture fullName email",
    });

    console.log("👤 Team leader info populated:", team.leader);

    console.log("✅ Team verification successful");
    return NextResponse.json({ success: true, team }, { status: 200 });
  } catch (err) {
    console.error("❌ Team verification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

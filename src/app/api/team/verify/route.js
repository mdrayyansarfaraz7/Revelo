import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Team from "@/models/teamModel";
import User from "@/models/userModel";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";

export async function POST(req) {
  try {
    await dbConnect();

    const { joiningCode, eventId, eventModel } = await req.json();

    if (!joiningCode || !eventId || !eventModel) {
      return NextResponse.json(
        { error: "Joining code, Event ID, and Event Model are required" },
        { status: 400 }
      );
    }

    console.log("Verifying team:", { joiningCode, eventId, eventModel });

    // Find the team
    const team = await Team.findOne({
      joinCode: joiningCode,
      eventRef: eventId,
      eventModel, // "Event" | "SubEvent"
    }).populate({
      path: "members",
      select: "username profilePicture fullName email",
    });

    if (!team) {
      return NextResponse.json(
        { error: `Team not found for this ${eventModel}` },
        { status: 404 }
      );
    }

    // Fetch the event/subevent to get team size criteria
    let eventDoc = null;

    if (eventModel === "SubEvent") {
      eventDoc = await SubEvent.findById(eventId);
    } else if (eventModel === "Event") {
      eventDoc = await Event.findById(eventId);
    }

    if (!eventDoc) {
      return NextResponse.json(
        { error: `${eventModel} not found` },
        { status: 404 }
      );
    }

    const minTeamSize = eventDoc.teamSize?.min;
    const maxTeamSize = eventDoc.teamSize?.max;
    const totalMembers = team.members.length;
    console.log(minTeamSize);
    console.log(maxTeamSize);
    console.log(totalMembers);


    if (totalMembers < minTeamSize || totalMembers > maxTeamSize) {
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

    return NextResponse.json({ success: true, team }, { status: 200 });
  } catch (err) {
    console.error("Team verification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

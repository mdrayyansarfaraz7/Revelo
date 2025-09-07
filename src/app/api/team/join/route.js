import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Team from "@/models/teamModel.js";
import User from "@/models/userModel.js";
import Event from "@/models/eventModel.js";     
import SubEvent from "@/models/subEventModel.js";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id;
    const { joinCode } = await req.json();

    console.log("📥 Join request received:", { joinCode, userId });

    // Step 1: Find the team using join code
    const team = await Team.findOne({ joinCode });
    if (!team) {
      return NextResponse.json({ error: "Invalid join code." }, { status: 404 });
    }

    console.log("✅ Found team:", team._id, "for", team.eventModel, team.eventRef);

    // Step 2: Fetch event or subevent to check team size
    let maxParticipants;
    if (team.eventModel === "Event") {
      const event = await Event.findById(team.eventRef);
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      maxParticipants = event.teamSize?.max || 1;
    } else if (team.eventModel === "SubEvent") {
      const subEvent = await SubEvent.findById(team.eventRef);
      if (!subEvent) {
        return NextResponse.json({ error: "Sub-event not found" }, { status: 404 });
      }
      maxParticipants = subEvent.teamSize?.max || 1;
    }

    console.log("👥 Max allowed team size:", maxParticipants);

    // Step 3: Check if team is already full
    if (team.members.length >= maxParticipants) {
      console.warn(`⚠️ Team ${team._id} is full (${team.members.length}/${maxParticipants})`);
      return NextResponse.json(
        { error: "This team is already full." },
        { status: 400 }
      );
    }

    // Step 4: Check if user already in a team for this event
    const existingTeam = await Team.findOne({
      eventRef: team.eventRef,
      eventModel: team.eventModel,
      members: userId,
    });

    if (existingTeam) {
      console.warn(
        `⚠️ User ${userId} already in team ${existingTeam._id} for event ${team.eventRef}`
      );
      return NextResponse.json(
        {
          error: "You are already in a team for this event.",
          teamId: existingTeam._id,
          joinCode: existingTeam.joinCode,
        },
        { status: 400 }
      );
    }

    // Step 5: Add user to team
    await Team.findByIdAndUpdate(team._id, {
      $addToSet: { members: userId },
    });

    // Step 6: Update user's teams[]
    await User.findByIdAndUpdate(userId, {
      $addToSet: { teams: team._id },
    });

    console.log(` User ${userId} joined team ${team._id}`);

    return NextResponse.json(
      {
        message: "Joined team successfully",
        teamId: team._id,
        joinCode: team.joinCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(" Error joining team:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

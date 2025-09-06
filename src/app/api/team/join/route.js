import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Team from "@/models/teamModel.js";
import User from "@/models/userModel.js";
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

    console.log("Join request received:", { joinCode, userId });

    // Step 1: Find the team using join code
    const team = await Team.findOne({ joinCode });
    if (!team) {
      return NextResponse.json(
        { error: "Invalid join code." },
        { status: 404 }
      );
    }

    console.log("Found team:", team._id, "for event:", team.eventRef);

    const existingTeam = await Team.findOne({
      eventRef: team.eventRef,
      eventModel: team.eventModel,
      members: userId,
    });

    if (existingTeam) {
      console.warn(
        ` User ${userId} already in team ${existingTeam._id} for event ${team.eventRef}`
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

    // Step 3: Add user to team
    await Team.findByIdAndUpdate(team._id, {
      $addToSet: { members: userId },
    });

    // Step 4: Update user's teams[]
    await User.findByIdAndUpdate(userId, {
      $addToSet: { teams: team._id },
    });

    console.log(`User ${userId} joined team ${team._id}`);

    return NextResponse.json(
      {
        message: "Joined team successfully",
        teamId: team._id,
        joinCode: team.joinCode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining team:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

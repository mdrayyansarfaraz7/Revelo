import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Team from "@/models/teamModel.js";
import User from "@/models/userModel.js";
import { getToken } from "next-auth/jwt";

function generateJoinCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req, { params }) {
  await dbConnect();
  console.log("📡 [TEAM API] Connection established with DB");

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("🔑 Decoded token:", token);

    if (!token) {
      console.warn("❌ Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: token.email });
    console.log("👤 User fetched from DB:", user?._id?.toString(), user?.email);

    if (!user) {
      console.warn("❌ User not found in DB for token email:", token.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id;
    const { teamName, type } = await req.json();
    const { id } = params;

    console.log("📥 Payload received:", { teamName, type, eventId: id });

    if (!teamName || !type || !["Event", "SubEvent"].includes(type)) {
      console.warn("⚠️ Invalid team creation payload:", { teamName, type });
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    console.log("🔍 Checking if user already has a team for this event...");
    const existingTeam = await Team.findOne({
      eventRef: id,
      eventModel: type,
      members: userId,
    });
    console.log("🔎 Existing team result:", existingTeam);

    if (existingTeam) {
      console.warn(
        `⚠️ User ${userId} already in team ${existingTeam._id} for event ${id}`
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

    console.log("🔑 Generating unique join code...");
    let joinCode;
    let existing;
    do {
      joinCode = generateJoinCode();
      existing = await Team.findOne({ joinCode });
      console.log("🎲 Generated joinCode:", joinCode, "Already exists?", !!existing);
    } while (existing);

    console.log("🚀 Creating new team with data:", {
      teamName,
      eventRef: id,
      eventModel: type,
      leader: userId,
    });

    const team = new Team({
      name: teamName,
      eventRef: id,
      eventModel: type,
      leader: userId,
      members: [userId],
      joinCode,
      registeredAt: new Date(),
    });

    await team.save();
    console.log("✅ Team saved in DB:", team._id);

    await User.findByIdAndUpdate(userId, { $addToSet: { teams: team._id } });
    console.log(`📌 User ${userId} updated with team ${team._id}`);

    return NextResponse.json(
      {
        message: "Team created successfully",
        teamId: team._id,
        joinCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("💥 Error creating team:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



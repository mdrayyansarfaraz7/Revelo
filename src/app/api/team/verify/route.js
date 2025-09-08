
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Team from "@/models/teamModel";
import User from "@/models/userModel";
import SubEvent from "@/models/subEventModel";

export async function POST(req) {
    try {
        await dbConnect();

        const { joiningCode, subEventId } = await req.json();

        if (!joiningCode || !subEventId) {
            return NextResponse.json(
                { error: "Joining code and SubEvent ID are required" },
                { status: 400 }
            );
        }

        // Find the team
        const team = await Team.findOne({
            joinCode: joiningCode,
            eventRef: subEventId,
            eventModel: "SubEvent",
        }).populate({
            path: "members",
            select: "username profilePicture fullName email",
        });

        if (!team) {
            return NextResponse.json(
                { error: "Team not found for this SubEvent" },
                { status: 404 }
            );
        }

        // Fetch SubEvent to get min/max team size
        const subEvent = await SubEvent.findById(subEventId);
        if (!subEvent) {
            return NextResponse.json(
                { error: "SubEvent not found" },
                { status: 404 }
            );
        }

        const minTeamSize = subEvent.teamSize?.min;
        const maxTeamSize = subEvent.teamSize?.max;
        const totalMembers = team.members.length;

        if (totalMembers < minTeamSize || totalMembers > maxTeamSize) {
            return NextResponse.json(
                { error: "Team is not complete or invalid size" },
                { status: 400 }
            );
        }

        // Populate leader info
        await team.populate({ path: "leader", select: "username profilePicture fullName email" });

        return NextResponse.json({ success: true, team }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

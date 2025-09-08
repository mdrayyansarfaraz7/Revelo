import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";
import Registration from "@/models/registrationModel";
import User from "@/models/userModel";
import Team from "@/models/teamModel";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  console.log("Incoming registration request with params:", params);

  await dbConnect();
  console.log("Database connected");

  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = user._id;
    console.log("Registering user ID:", userId.toString());

    const { id: eventId } = params;
    const body = await req.json();
    const { eventModel, isTeam, team: teamId, orderId, paymentId } = body;

    if (!eventId || !eventModel) {
      return NextResponse.json(
        { error: "Event ID and model are required" },
        { status: 400 }
      );
    }
    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: "Payment details are required" },
        { status: 400 }
      );
    }

    // Pick model dynamically
    const Model = eventModel === "SubEvent" ? SubEvent : Event;

    const eventDoc = await Model.findById(eventId);
    if (!eventDoc)
      return NextResponse.json(
        { error: `${eventModel} not found` },
        { status: 404 }
      );
    console.log(`${eventModel} found:`, eventDoc.title);

    // Check duplicate registration
    const exists = await Registration.findOne({
      eventId,
      eventModel,
      ...(isTeam ? { team: teamId } : { registeredBy: userId }),
    });
    if (exists)
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );

    const registration = await Registration.create({
      eventId,
      eventModel,
      registeredBy: userId,
      team: isTeam ? teamId : null,
      isTeam,
      orderId,
      paymentId,
    });
    console.log("Registration created with ID:", registration._id.toString());

    let participantIds = [userId]; 

    if (isTeam) {
      if (!teamId)
        return NextResponse.json(
          { error: "Team ID is required for team registration" },
          { status: 400 }
        );

      const teamDoc = await Team.findById(teamId).select("members");
      if (!teamDoc)
        return NextResponse.json({ error: "Team not found" }, { status: 404 });

      participantIds = Array.from(
        new Set([...participantIds, ...teamDoc.members.map((m) => m.toString())])
      );
      console.log("Team participants to update:", participantIds);
    }

    // Update participation for all participants
    const updatedUsers = await User.updateMany(
      { _id: { $in: participantIds } },
      {
        $push: {
          participation: {
            itemId: eventId,
            itemType: eventModel, // "Event" or "SubEvent"
            registrationId: registration._id,
          },
        },
      }
    );
    console.log(
      `Participation updated for ${updatedUsers.modifiedCount} users`
    );

    // Update Event/SubEvent registrations
    const updatedEvent = await Model.findByIdAndUpdate(
      eventId,
      { $push: { registrations: registration._id } },
      { new: true }
    );
    console.log(
      `${eventModel} registrations updated. Total:`,
      updatedEvent.registrations.length
    );

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

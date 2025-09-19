import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";
import Registration from "@/models/registrationModel";
import User from "@/models/userModel";
import Team from "@/models/teamModel";
import Institute from "@/models/instituteModel";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = user._id;
    const { id: eventId } = params;
    const body = await req.json();
    const { eventModel, isTeam, team: teamId, orderId, paymentId } = body;

    if (!eventId || !eventModel) {
      return NextResponse.json({ error: "Event ID and model are required" }, { status: 400 });
    }
    if (!orderId || !paymentId) {
      return NextResponse.json({ error: "Payment details are required" }, { status: 400 });
    }

    // Pick model dynamically
    const Model = eventModel === "SubEvent" ? SubEvent : Event;
    const eventDoc = await Model.findById(eventId);
    if (!eventDoc)
      return NextResponse.json({ error: `${eventModel} not found` }, { status: 404 });

    // Check duplicate registration
    const exists = await Registration.findOne({
      eventId,
      eventModel,
      ...(isTeam ? { team: teamId } : { registeredBy: userId }),
    });
    if (exists) return NextResponse.json({ error: "Already registered" }, { status: 400 });

    // Create registration
    const registration = await Registration.create({
      eventId: eventModel === "Event" ? eventId : null,
      subEventId: eventModel === "SubEvent" ? eventId : null, // store subEventId if it's a SubEvent
      eventModel,
      registeredBy: userId,
      team: isTeam ? teamId : null,
      isTeam,
      orderId,
      paymentId,
    });

    // Collect participants (user or team)
    let participantIds = [userId];
    if (isTeam) {
      const teamDoc = await Team.findById(teamId).select("members");
      if (!teamDoc) return NextResponse.json({ error: "Team not found" }, { status: 404 });

      participantIds = Array.from(
        new Set([...participantIds, ...teamDoc.members.map((m) => m.toString())])
      );
    }

    await User.updateMany(
      { _id: { $in: participantIds } },
      {
        $push: {
          participation: {
            itemId: eventId,
            itemType: eventModel,
            registrationId: registration._id,
          },
        },
      }
    );

    // Update event/subEvent registrations
    await Model.findByIdAndUpdate(
      eventId,
      { $push: { registrations: registration._id } },
      { new: true }
    );

    // ---------------------------------------
    //  Earnings update logic (direct settlement)
    // ---------------------------------------
    let instituteId;

    if (eventModel === "Event") {
      instituteId = eventDoc.instituteID;
    } else {
      // For SubEvent, use parentEvent
      const parentEvent = await Event.findById(eventDoc.parentEvent);
      if (!parentEvent) {
        return NextResponse.json({ error: "Parent event not found" }, { status: 404 });
      }
      instituteId = parentEvent.instituteID;
    }

    const institute = await Institute.findById(instituteId);
    if (!institute) {
      return NextResponse.json({ error: "Institute not found" }, { status: 404 });
    }

    // Amount (from event fee or subEvent price)
    const amount =
      eventModel === "Event"
        ? eventDoc.registrationFee || eventDoc.ticketPrice || 0
        : eventDoc.price || 0;

    if (amount > 0) {
      const platformFee = amount * 0.05; // 5% Revelo fee
      const netAmount = amount - platformFee;

      // Find earnings entry for this event
      let earningsEntry = institute.earnings.find(
        (e) => e.eventId.toString() === (eventModel === "Event" ? eventId : eventDoc.parentEvent.toString())
      );

      if (!earningsEntry) {
        institute.earnings.push({
          eventId: eventModel === "Event" ? eventId : eventDoc.parentEvent,
          pendingEarnings: 0,
          totalEarnings: 0,
          platformFee: 0,
          transactions: [],
        });
        earningsEntry = institute.earnings[institute.earnings.length - 1];
      }

      // Directly settle earnings
      earningsEntry.totalEarnings += netAmount;
      earningsEntry.platformFee += platformFee;
      earningsEntry.transactions.push({
        type: eventModel === "Event" ? "participation" : "ticket",
        amount,
        platformFee,
        netAmount,
        status: "settled",
      });

      await institute.save();
    }

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

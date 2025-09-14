import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";
import Registration from "@/models/registrationModel";
import Ticket from "@/models/ticketModel";
import Payment from "@/models/PaymentModel";
import User from "@/models/userModel";
import Team from "@/models/teamModel";
import Institute from "@/models/instituteModel";
import Flyer from "@/models/flyerModel";
import Video from "@/models/videoModel";

export async function GET() {
  await dbConnect();

  try {
    await Promise.all([
      Event.deleteMany({}),
      SubEvent.deleteMany({}),
      Registration.deleteMany({}),
      Ticket.deleteMany({}),
      Payment.deleteMany({}),
      Team.deleteMany({}),
      Flyer.deleteMany({}),
      Video.deleteMany({}),
      User.deleteMany({}),
      Institute.deleteMany({})
    ]);

    return NextResponse.json({ success: true, message: "All collections cleared " });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
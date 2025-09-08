import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubEvent from "@/models/subEventModel";
import Registration from "@/models/registrationModel";
import User from "@/models/userModel"; 
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
  console.log("📥 Incoming registration request with params:", params);

  await dbConnect();
  console.log("✅ Database connected");

  try {
    const session = await getServerSession();
    console.log("🔑 Session data:", session);

    if (!session) {
      console.log("❌ Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Find user by email (since session has no id)
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.log("❌ User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user._id;
    console.log("👤 Authenticated user ID:", userId.toString());

    const { id: subEventId } = params;
    const body = await req.json();
    const { isTeam, team, orderId, paymentId } = body;

    console.log("📦 Request body:", body);

    // ✅ Validate required fields
    if (!subEventId) {
      console.log("❌ Missing subEventId");
      return NextResponse.json({ error: "SubEvent ID is required" }, { status: 400 });
    }
    if (!orderId || !paymentId) {
      console.log("❌ Missing payment details");
      return NextResponse.json({ error: "Payment details are required" }, { status: 400 });
    }

    // ✅ Ensure subevent exists
    const subEvent = await SubEvent.findById(subEventId);
    console.log("🔎 SubEvent lookup result:", subEvent);

    if (!subEvent) {
      console.log("❌ SubEvent not found:", subEventId);
      return NextResponse.json({ error: "SubEvent not found" }, { status: 404 });
    }

    // ✅ Prevent duplicate registration
    const exists = await Registration.findOne({
      subEventId,
      ...(isTeam ? { team } : { registeredBy: userId }),
    });
    console.log("🔎 Existing registration:", exists);

    if (exists) {
      console.log("⚠️ Duplicate registration attempt");
      return NextResponse.json({ error: "Already registered" }, { status: 400 });
    }

    // ✅ Save registration
    const registration = await Registration.create({
      subEventId,
      registeredBy: userId,
      team: isTeam ? team : null,
      isTeam,
      orderId,
      paymentId,
    });
    console.log("✅ Registration saved:", registration);

    // ✅ Link registration to user
const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    $push: {
      participation: {
        itemId: subEventId,
        itemType: "SubEvent",
        registrationId: registration._id,
      },
    },
  },
  { new: true }
);

console.log("✅ User participation updated:", updatedUser);

await SubEvent.findByIdAndUpdate(
  subEventId,
  { $push: { registrations: registration._id } },
  { new: true }
);

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

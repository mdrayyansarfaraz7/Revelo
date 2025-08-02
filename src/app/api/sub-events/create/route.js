import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SubEvent from "@/models/subEventModel";
import Event from "@/models/eventModel";

export async function POST(req) {
  try {
    console.log("📥 Incoming request to create sub-event");

    await dbConnect();
    console.log("✅ Connected to database");

    const body = await req.json();
    console.log("🧾 Request body:", body);

    const {
      eventId,
      title,
      scheduledAt,
      venue,
      price = 0,
      teamRequired = false,
      teamSize = { min: 1, max: 1 },
      category,
      banner,
      contactDetails,
      rules,
    } = body;

    if (
      !eventId ||
      !title ||
      !scheduledAt ||
      !venue ||
      !category ||
      !banner ||
      !contactDetails ||
      !rules ||
      rules.length === 0
    ) {
      console.warn("⚠️ Missing or invalid required fields");
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      console.warn("⚠️ Invalid scheduledAt date:", scheduledAt);
      return NextResponse.json({ message: "Invalid scheduledAt date" }, { status: 400 });
    }

    if (teamRequired) {
      if (
        typeof teamSize !== "object" ||
        typeof teamSize.min !== "number" ||
        typeof teamSize.max !== "number" ||
        teamSize.min < 1 ||
        teamSize.max < teamSize.min
      ) {
        console.warn("⚠️ Invalid team size configuration:", teamSize);
        return NextResponse.json(
          { message: "Invalid team size configuration" },
          { status: 400 }
        );
      }
    }

    const parentEvent = await Event.findById(eventId);
    if (!parentEvent) {
      console.warn("❌ Parent event not found for ID:", eventId);
      return NextResponse.json({ message: "Parent event not found" }, { status: 404 });
    }
    console.log("✅ Parent event found:", parentEvent.title);

    const newSubEvent = await SubEvent.create({
      title,
      scheduledAt: scheduledDate,
      venue,
      price: Number(price) || 0,
      teamRequired,
      teamSize: {
        min: teamSize.min ?? 1,
        max: teamSize.max ?? 1,
      },
      category,
      banner,
      contactDetails,
      rules: rules.map((r) => r.trim()).filter((r) => r),
      registrations: [],
    });

    console.log("✅ Sub-event created:", newSubEvent._id);

    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { subEvents: newSubEvent._id } },
      { new: true }
    );

    console.log("🔗 Sub-event added to parent event");

    return NextResponse.json(
      { message: "Sub-event created successfully", subEvent: newSubEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Sub-event creation error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error?.message || String(error) },
      { status: 500 }
    );
  }
}

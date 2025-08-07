import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Institute from "@/models/instituteModel";
import Event from "@/models/eventModel";
import Payment from "@/models/PaymentModel";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      instituteID,
      title,
      description,
      category,
      thumbnail,
      allowDirectRegistration,
      isTicketed,
      registrationFee,
      ticketPrice,
      venue,
      city,
      state,
      country,
      pinCode,
      from,
      to,
      registrationStarts,
      registrationEnds,
      paymentData,
      teamRequired,
      teamSize,
      rules,
    } = body;

    console.log("Incoming Event Creation Request:", { title, instituteID });

    // Validate required base fields
    const requiredFields = [
      "instituteID",
      "title",
      "description",
      "category",
      "thumbnail",
      "venue",
      "city",
      "state",
      "country",
      "pinCode",
      "from",
      "to",
      "registrationStarts",
      "registrationEnds",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
    }

    // Date validations
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const regStart = new Date(registrationStarts);
    const regEnd = new Date(registrationEnds);

    if (fromDate > toDate) {
      return NextResponse.json({ message: "Event start date must be before end date." }, { status: 400 });
    }

    if (regStart > toDate || regEnd > toDate) {
      return NextResponse.json({ message: "Registration dates must be before event ends." }, { status: 400 });
    }

    // Direct registration validation
    if (allowDirectRegistration === true) {
      if (
        registrationFee === undefined ||
        registrationFee === null ||
        registrationFee === "" ||
        isNaN(registrationFee)
      ) {
        return NextResponse.json(
          { message: "Registration fee is required and must be a valid number." },
          { status: 400 }
        );
      }

      if (!Array.isArray(rules) || rules.length === 0 || rules.some(r => !r || typeof r !== "string" || r.trim() === "")) {
        return NextResponse.json(
          { message: "At least one valid rule is required for direct registration." },
          { status: 400 }
        );
      }

      if (typeof teamRequired !== "boolean") {
        return NextResponse.json(
          { message: "teamRequired must be specified as a boolean." },
          { status: 400 }
        );
      }

      if (teamRequired === true) {
        if (
          !teamSize ||
          typeof teamSize.min !== "number" ||
          typeof teamSize.max !== "number"
        ) {
          return NextResponse.json(
            { message: "Invalid team size structure." },
            { status: 400 }
          );
        }

        if (teamSize.min < 1) {
          return NextResponse.json(
            { message: "Minimum team size must be at least 1." },
            { status: 400 }
          );
        }

        if (teamSize.max < teamSize.min) {
          return NextResponse.json(
            { message: "Maximum team size cannot be less than minimum." },
            { status: 400 }
          );
        }
      }
    }

    // Ticket price validation
    if (isTicketed) {
      if (
        ticketPrice === undefined ||
        ticketPrice === null ||
        ticketPrice === "" ||
        isNaN(ticketPrice)
      ) {
        return NextResponse.json({ message: "Ticket price required" }, { status: 400 });
      }
    }

    // Check institute
    const institute = await Institute.findById(instituteID);
    if (!institute) {
      return NextResponse.json({ message: "Invalid Institute ID" }, { status: 404 });
    }

    // Create payment entry
    const newPayment = await Payment.create({
      instituteID,
      amount: 99,
      razorpayOrderID: paymentData?.order_id || "",
      razorpayPaymentID: paymentData?.payment_id || "",
      verified: true,
      purpose: "EventCreation",
    });

    const eventData = {
      title,
      description,
      category,
      thumbnail,
      allowDirectRegistration,
      isTicketed,
      registrationFee: allowDirectRegistration ? Number(registrationFee) || 0 : 0,
      ticketPrice: isTicketed ? Number(ticketPrice) || 0 : 0,
      location: {
        venue,
        city,
        state,
        country,
        pinCode,
      },
      duration: [fromDate, toDate],
      registrationStarts: regStart,
      registrationEnds: regEnd,
      instituteID,
      isPlatformPaymentDone: true,
      paymentRef: newPayment._id,
      teamRequired: allowDirectRegistration ? teamRequired : false,
      teamSize: allowDirectRegistration && teamRequired ? teamSize : { min: 1, max: 1 },
    };

    if (allowDirectRegistration) {
      eventData.rules = rules.map(r => r.trim());
    }

    const newEvent = await Event.create(eventData);

    await Institute.findByIdAndUpdate(
      instituteID,
      { $push: { events: newEvent._id } },
      { new: true }
    );

    console.log("Event created successfully:", newEvent._id);

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Event creation failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

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


        console.log(instituteID);

        // Validate required fields
        if (
            !instituteID ||
            !title ||
            !description ||
            !category ||
            !thumbnail ||
            !venue ||
            !city ||
            !state ||
            !country ||
            !pinCode ||
            !from ||
            !to ||
            !registrationStarts ||
            !registrationEnds
        ) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (allowDirectRegistration) {
            if (!registrationFee || isNaN(registrationFee)) {
                return NextResponse.json({ message: "Registration fee required" }, { status: 400 });
            }

            if (!rules || !Array.isArray(rules) || rules.length === 0 || rules.some(r => !r || r.trim() === "")) {
                return NextResponse.json({ message: "At least one valid rule is required for direct registration." }, { status: 400 });
            }

            if (teamRequired) {
                if (!teamSize || typeof teamSize.min !== "number" || typeof teamSize.max !== "number") {
                    return NextResponse.json({ message: "Invalid team size structure." }, { status: 400 });
                }

                if (teamSize.min < 1) {
                    return NextResponse.json({ message: "Minimum team size must be at least 1." }, { status: 400 });
                }

                if (teamSize.max < teamSize.min) {
                    return NextResponse.json({ message: "Maximum team size cannot be less than minimum." }, { status: 400 });
                }
            }
        }


        if (isTicketed && (!ticketPrice || isNaN(ticketPrice))) {
            return NextResponse.json({ message: "Ticket price required" }, { status: 400 });
        }

        const institute = await Institute.findById(instituteID);
        if (!institute) {
            return NextResponse.json({ message: "Invalid Institute ID" }, { status: 404 });
        }

        // Create Payment Entry
        const newPayment = await Payment.create({
            instituteID,
            amount: 99, // Assume ₹99 fixed for Event Creation
            razorpayOrderID: paymentData?.order_id || "",
            razorpayPaymentID: paymentData?.payment_id || "",
            verified: true,
            purpose: "EventCreation",
        });

        const newEvent = await Event.create({
            title,
            description,
            category,
            thumbnail,
            allowDirectRegistration,
            isTicketed,
            registrationFee: allowDirectRegistration ? Number(registrationFee) : 0,
            ticketPrice: isTicketed ? Number(ticketPrice) : 0,
            location: {
                venue,
                city,
                state,
                country,
                pinCode,
            },
            duration: [new Date(from), new Date(to)],
            registrationStarts: new Date(registrationStarts),
            registrationEnds: new Date(registrationEnds),
            instituteID,
            isPlatformPaymentDone: true,
            paymentRef: newPayment._id,
            teamRequired: allowDirectRegistration ? teamRequired : false,
            teamSize: allowDirectRegistration && teamRequired ? teamSize : { min: 1, max: 1 },
            rules: allowDirectRegistration ? rules : [],
        });


        await Institute.findByIdAndUpdate(
            instituteID,
            { $push: { events: newEvent._id } },
            { new: true }
        );

        return NextResponse.json(
            { message: "Event created successfully", event: newEvent },
            { status: 201 }
        );
    } catch (error) {
        console.error("Event creation failed:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

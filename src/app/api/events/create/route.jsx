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
            paymentData,
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
            !to
        ) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (allowDirectRegistration && (!registrationFee || isNaN(registrationFee))) {
            return NextResponse.json({ message: "Registration fee required" }, { status: 400 });
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

        // Create Event
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
            instituteID,
            isPlatformPaymentDone: true,
            paymentRef: newPayment._id,
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

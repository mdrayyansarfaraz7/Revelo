import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export async function POST(req) {
    const { amount } = await req.json();
    const options = {
        amount,
        currency: "INR",
        receipt: "Revelo_Event_Creation" + Date.now(),
    };
    try {
    const order = await instance.orders.create(options);
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
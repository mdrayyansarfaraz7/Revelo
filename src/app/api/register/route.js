import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail"; // Your Resend utility

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists, please log in." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verifyToken: verifyCode,
      verifyTokenExpiry: Date.now() + 10 * 60 * 1000, 
    });

    await sendVerificationEmail(email, verifyCode);

    return NextResponse.json(
      { message: "User registered successfully. Verification email sent.", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

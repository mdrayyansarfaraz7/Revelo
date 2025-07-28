import { NextResponse } from "next/server";
import Institute from '@/models/instituteModel';
import { verifyAdmin } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';

export async function GET(req) {

  try {
    await dbConnect();
    console.log("Connected to DB");

    const institutesNotVerified = await Institute.find({ isVerified: false });
    const institutesVerified = await Institute.find({ isVerified: true });

    console.log("Fetched institutes:", {
      verified: institutesVerified.length,
      notVerified: institutesNotVerified.length,
    });

    return NextResponse.json(
      { institutesNotVerified, institutesVerified },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching institutes:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

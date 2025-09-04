
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; 
import Institute from "@/models/instituteModel.js"; 

export async function GET() {
  try {
    await dbConnect();

    const institutes = await Institute.find({}, { _id: 1, instituteName: 1 });

    return NextResponse.json(
      { success: true, data: institutes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching institutes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch institutes" },
      { status: 500 }
    );
  }
}

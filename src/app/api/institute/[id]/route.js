import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Institute from "@/models/instituteModel";

// Handles GET /api/institute/:id
export async function GET(req, { params }) {
  const { id } = await params;

  await dbConnect();

  try {
    const institute = await Institute.findById(id);

    if (!institute) {
      return NextResponse.json({ error: "Institute not found" }, { status: 404 });
    }

    return NextResponse.json({ institute: institute.toObject() }, { status: 200 });
  } catch (error) {
    console.error("Error fetching institute:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

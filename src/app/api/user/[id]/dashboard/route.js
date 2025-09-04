import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const user = await User.findById(id)
      .populate("instituteRef")  
      .populate("teams")          
      .populate("participation")  
      .populate("coordinatorFor"); 

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching data", error: error.message },
      { status: 500 }
    );
  }
}

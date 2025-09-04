import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const user = await User.findById(id)
      .populate("instituteRef")
      .populate("teams")
      .populate("participation")
      .populate("coordinatorFor");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();

    const {
      fullName,
      profilePicture,
      instituteName,   
      instituteRef,    
      IdProof,
    } = body;

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (profilePicture) updates.profilePicture = profilePicture;
    if (IdProof) updates.IdProof = IdProof;
    if (instituteName) updates.instituteName = instituteName;

    if (instituteRef) {
      updates.instituteRef = instituteRef;
    } else {
      updates.instituteRef = undefined; 
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true })
      .populate("instituteRef")
      .populate("teams")
      .populate("participation")
      .populate("coordinatorFor");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}

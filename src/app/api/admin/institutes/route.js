
import { NextResponse } from "next/server";
import Institute from '@/models/instituteModel';
import { verifyAdmin } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';

export async function GET(req) {
  const isAdmin = verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await dbConnect();

  const institutes = await Institute.find({ isVerified: false }); 
  return NextResponse.json({ institutes }, { status: 200 });
}

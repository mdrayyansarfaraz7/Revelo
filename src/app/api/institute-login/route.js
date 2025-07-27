import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/instituteModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json(); 
  const { institute, password } = body;

  if (!institute || !password) {
    return NextResponse.json({ error: "Credentials required" }, { status: 403 });
  }

  await dbConnect();

  const instituteDoc = await Institute.findOne({ instituteName: institute }).select('+password');

  if (!instituteDoc) {
    return NextResponse.json({ error: "Institute does not exist" }, { status: 403 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, instituteDoc.password);

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: "Incorrect Password" }, { status: 403 });
  }

  if (!instituteDoc.isVerified) {
    return NextResponse.json({ error: "Institute Not Verified By the Admin" }, { status: 403 });
  }
  const token = jwt.sign(
    {
      id: instituteDoc._id,
      role: 'institute',
      name: instituteDoc.instituteName,
    },
    process.env.JWT_SECRET,
    { expiresIn: '12d' }
  );

  cookies().set('institute_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 12 
});

return NextResponse.json({ success: true });
}

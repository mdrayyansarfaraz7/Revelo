import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/instituteModel';

export async function GET(req) {
  await dbConnect();
  const token = req.cookies.get('institute_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const institute = await Institute.findById(decoded.id).select('name email');

    if (!institute) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      instituteId: institute._id,
      name: institute.name,
      email: institute.email,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

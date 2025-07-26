import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/instituteModel';
import { verifyAdmin } from '@/lib/adminAuth';

export async function PUT(req, context) {
  const { params } = context;

  const isAdmin = await verifyAdmin(req); 
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await dbConnect();

  const { id } = params;

  const updated = await Institute.findByIdAndUpdate(
    id,
    {
      isVerified: true,
      verificationStatus: 'approved',
      verificationDate: new Date(),
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: 'Institute not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Approved', institute: updated }, { status: 200 });
}

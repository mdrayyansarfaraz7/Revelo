import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/instituteModel';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      instituteName,
      address,
      state,
      country,
      contactNumber,
      officeEmail,
      password,
      instituteType,
      logoUrl,
      verificationLetterUrl,
    } = body;

    // Basic validation
    if (
      !instituteName || !address || !state || !country || !contactNumber ||
      !officeEmail || !password || !instituteType || !logoUrl || !verificationLetterUrl
    ) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
      });
    }

    await dbConnect();

    const existing = await Institute.findOne({
      $or: [{ instituteName }, { officeEmail }],
    });

    if (existing) {
      return new Response(JSON.stringify({ error: 'Institute already exists' }), {
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstitute = await Institute.create({
      instituteName,
      address,
      state,
      country,
      contactNumber,
      officeEmail,
      instituteType,
      password: hashedPassword,
      logo: logoUrl,
      verificationLetter: verificationLetterUrl,
    });

    return new Response(
      JSON.stringify({
        message: 'Institute registered successfully',
        instituteId: newInstitute._id,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error('Error registering institute:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}

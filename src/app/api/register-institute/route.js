import dbConnect from '@/lib/dbConnect';
import Institute from '@/models/Institute';
import upload from '@/lib/multer';
import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

handler.use(
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'verificationLetter', maxCount: 1 },
  ])
);

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const {
      instituteName,
      address,
      state,
      country,
      contactNumber,
      officeEmail,
      password,
      instituteType,
    } = req.body;

    if (
      !instituteName || !address || !state || !country || !contactNumber ||
      !officeEmail || !password || !instituteType ||
      !req.files['logo'] || !req.files['verificationLetter']
    ) {
      return res.status(400).json({ error: 'Missing required fields or files' });
    }

    const existing = await Institute.findOne({
      $or: [
        { instituteName: instituteName },
        { officeEmail: officeEmail },
      ],
    });

    if (existing) {
      return res.status(409).json({ error: 'Institute already exists' });
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
      logo: req.files['logo'][0].path,
      verificationLetter: req.files['verificationLetter'][0].path,
    });

    res.status(201).json({
      message: 'Institute registered successfully',
      instituteId: newInstitute._id,
    });
  } catch (err) {
    console.error('[REGISTER INSTITUTE]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default handler;

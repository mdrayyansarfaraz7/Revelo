import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
    const body = await req.json();
    const { email, password } = body;

    if (email === process.env.REVELO_ADMIN_EMAIL && password === process.env.REVELO_ADMIN_SECRET) {
        const token = jwt.sign(
            { role: 'admin' },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: '12h' }
        );

        return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
};

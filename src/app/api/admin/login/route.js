import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export const POST = async (req) => {
    const body = await req.json();
    const { email, password } = body;

    if (email === process.env.REVELO_ADMIN_EMAIL && password === process.env.REVELO_ADMIN_SECRET) {
        const token = jwt.sign(
            { role: 'admin' },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: '12h' }
        );

        cookies().set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 12
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
};

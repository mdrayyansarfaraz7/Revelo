import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: 'Logged Out' });

  response.cookies.set('institute_token', '', {
    maxAge: 0,
    path: '/',
  });

  return response; 
}

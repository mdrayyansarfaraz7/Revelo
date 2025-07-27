import { NextResponse } from "next/server";

export async function GET() {
    const responce=NextResponse.json({message:'Logged Out'});
    responce.cookies.set('institute_token','',{maxAge:0, path: '/' })
}

import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect.js'
import Video from '@/models/videoModel.js'

export async function GET(req, { params }) {
    dbConnect();
    try {
            const { userId } = await req.json();
            if(!userId){
                return NextResponse.json({ error: "No User found,you are not login" }, { status: 404 });
            }
            const reel = await Video.findById(params.id);

            if(!reel){
                return NextResponse.json({ error: "Not found" }, { status: 404 });
            }

            return NextResponse.json({message:"success",reel},{status:200});

    } catch (error) {
        console.log("Error in fetching data of this reel", error);
        return NextResponse.json(
            { error: "Error in fetching data of this reel", details: err.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel"; 
import Coordinator from "@/models/userModel";
import Flyer from "@/models/flyerModel";
import Video from "@/models/videoModel";

export async function GET(req, context) {
    try{
    console.log("params:", context.params);
    const id = await context?.params?.id;

        if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
            return NextResponse.json({ message: "Invalid event ID" }, { status: 400 });
        }

        // Fetch event by ID
        const event = await Event.findById(id).populate('subEvents').populate('coordinators').populate('flyers').populate('videos');;

        if (!event) {
            return NextResponse.json({ message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
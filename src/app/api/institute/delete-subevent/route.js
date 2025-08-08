import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"
import Event from "@/models/eventModel";
import SubEvent from "@/models/subEventModel";

export async function DELETE(req) {
    await dbConnect();
    try {
            const body = await req.json();
    const {
        eventId,
        subEventId
    } = body;

    if (!eventId || !subEventId) {
        return NextResponse.json({ message: "Ids required" }, { status: 401 });
    }

    await Event.findByIdAndUpdate(
        eventId,
        { $pull: { subEvents: subEventId } },
        { new: true }
    );

    const subEvetDeleated=await SubEvent.findByIdAndDelete(subEventId);

    return NextResponse.json({ message: "successfully deleated" ,subEvetDeleated}, { status: 200 });
        
    } catch (error) {
          return NextResponse.json({ message: "something whent wrong while deleated! " }, { status: 500 });
    }
}

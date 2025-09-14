import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/eventModel';

export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find({ isTicketed: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching ticketed events:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch ticketed events',
      error: error.message,
    }, { status: 500 });
  }
}

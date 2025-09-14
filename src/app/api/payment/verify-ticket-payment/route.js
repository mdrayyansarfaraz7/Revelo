import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect.js';
import Ticket from '@/models/ticketModel.js';
import User from '@/models/userModel.js';
import Event from '@/models/eventModel';
import Institute from '@/models/instituteModel';
import { getServerSession } from 'next-auth';

export async function POST(req) {
    await dbConnect();

    try {
        // ✅ Get session
        const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // ✅ Get user from DB
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // ✅ Extract body
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, eventId, quantity, amount } = await req.json();

        // 🔐 Verify Razorpay signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
        }

        // 🎟 Create ticket
        const ticketCode = crypto.randomBytes(6).toString('hex').toUpperCase();

        const event = await Event.findById(eventId).populate('instituteID');
        const instituteId = event.instituteID._id;

        const payload = {
            ticketCode,
            event: event.name,
            buyer: user.fullName,
            email: user.email,
            quantity,
            amountPaid: amount,
            issuedAt: new Date().toISOString(),
        };

        const qrData = JSON.stringify(payload);

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

        const ticket = await Ticket.create({
            event: eventId,
            buyer: user._id,
            quantity,
            price: amount,
            ticketCode,
            qrCode: qrCodeUrl,
        });


        user.tickets.push(ticket._id);
        await user.save();



        const platformFeeRate = 0.05;
        const platformFee = amount * platformFeeRate;
        const netAmount = amount - platformFee;

        await Institute.findOneAndUpdate(
            { _id: instituteId, 'earnings.eventId': eventId },
            {
                $inc: {
                    'earnings.$.pendingEarnings': netAmount,
                    'earnings.$.totalEarnings': netAmount,
                    'earnings.$.platformFee': platformFee,
                },
                $push: {
                    'earnings.$.transactions': {
                        type: 'ticket',
                        amount,
                        platformFee,
                        netAmount,
                        status: 'pending',
                    },
                },
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Payment verified and ticket issued successfully',
            ticketId: ticket._id,
        });

    } catch (error) {
        console.error('Payment verify error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

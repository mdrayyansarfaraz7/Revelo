import mongoose from 'mongoose';

const InstituteSchema = new mongoose.Schema({
    instituteName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    officeEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    logo: {
        type: String,
        required: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    },
    instituteType: {
        type: String,
        enum: ['school', 'institute', 'university'],
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    verificationLetter: {
        type: String,
        required: true,
        trim: true
    },
    verificationDate: {
        type: Date,
        default: null
    },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],

    earnings: [
        {
            eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
            pendingEarnings: { type: Number, default: 0 },
            totalEarnings: { type: Number, default: 0 },
            platformFee: { type: Number, default: 0 }, 
            transactions: [
                {
                    type: {
                        type: String,
                        enum: ['ticket', 'participation'],
                        required: true
                    },
                    amount: Number,
                    platformFee: Number,
                    netAmount: Number,
                    status: { type: String, enum: ['pending', 'settled'], default: 'pending' },
                    createdAt: { type: Date, default: Date.now }
                }
            ]
        }
    ]

}, {
    timestamps: true
});

const Institute = mongoose.models.Institute || mongoose.model('Institute', InstituteSchema);

export default Institute;

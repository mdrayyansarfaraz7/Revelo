import mongoose from 'mongoose';
const { Schema, model, models, Types } = mongoose;

const EventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  
  instituteID: {
    type: Types.ObjectId,
    ref: 'Institute',
    required: true
  },

  coordinators: [{
    type: Types.ObjectId,
    ref: 'User'
  }],

  thumbnail: { type: String, trim: true, required: true },

  flyers: [{
    type: Types.ObjectId,
    ref: 'Flyer'
  }],

  videos: [{
    type: Types.ObjectId,
    ref: 'Video'
  }],

  categories: [{
    type: String,
    enum: [
      'Cultural Fest',
      'Tech Fest',
      'Hackathon',
      'Ideathon',
      'Workshop',
      'Sports',
      'Concerts',
      'E-Submits',
      'Carnival'
    ]
  }],

  subEvents: [{
    type: Types.ObjectId,
    ref: 'SubEvent'
  }],

  allowDirectRegistration: { type: Boolean, default: false },
  registrationFee: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },

  isTicketed: { type: Boolean, default: false },
  ticketPrice: { type: Number, default: 0 },
  ticketLimit: { type: Number },

  stats: {
    totalRegistrations: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },

  location: {
    venue: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, default: 'India' },
    pinCode: { type: String }
  },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  isPublished: { type: Boolean, default: false },
  isPaymentDone: { type: Boolean, default: false },

  paymentRef: { type: Types.ObjectId, ref: 'Payment' }

}, { timestamps: true });

const Event = models.Event || model('Event', EventSchema);
export default Event;

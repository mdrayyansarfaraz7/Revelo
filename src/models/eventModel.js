import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instituteID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  admin: [{
    adminRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'admin.role'
    },
    role: {
      type: String,
      enum: ['User', 'Institute'],
      required: true
    }
  }],
  coordinators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  thumbnail: {
    type: String,
    trim: true
  },
  flyers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flyer'
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  categories: [{
    type: String,
    enum: ['Cultural Fest', 'Tech Fest', 'Hackathon', 'Ideathon', 'Workshop', 'Sports']
  }],
  subEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubEvent'
  }],
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

  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }

}, {
  timestamps: true
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
export default Event;

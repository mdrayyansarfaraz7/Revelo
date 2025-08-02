import mongoose from 'mongoose';

const SubEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    default: 0
  },
  teamRequired: {
    type: Boolean,
    default: false
  },
  teamSize: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 1
    }
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  banner: {
    type: String,
    required: true
  },
  contactDetails: {
    type: String,
    required: true,
    trim: true
  },
  rules: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "At least one rule is required."
    }
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'  
  }]
}, {
  timestamps: true
});

const SubEvent = mongoose.models.SubEvent || mongoose.model('SubEvent', SubEventSchema);

export default SubEvent;

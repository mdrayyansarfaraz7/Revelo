import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  subEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubEvent',
    required: true
  },

  mode: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },

  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'under_review'],
    default: 'unpaid'
  },

  paymentProofUrl: {
    type: String 
  }

}, {
  timestamps: true
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
export default Registration;

import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
   
  },
  subEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubEvent',

  },

  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },

  // Solo vs Team
  isTeam: {
    type: Boolean,
    required: true
  },

  // Razorpay details (always required, since payment is mandatory)
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },

}, { timestamps: true });

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
export default Registration;

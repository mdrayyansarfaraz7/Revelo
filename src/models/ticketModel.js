import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  paymentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  ticketCode: {
    type: String,
    required: true,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
export default Ticket;

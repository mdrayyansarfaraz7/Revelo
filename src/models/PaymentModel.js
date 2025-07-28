import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  instituteID: { type: ObjectId, ref: 'Institute', required: true },
  amount: { type: Number, required: true }, 
  razorpayOrderID: String,
  razorpayPaymentID: String,
  verified: { type: Boolean, default: false },
  purpose: { type: String, enum: ['EventCreation', 'TicketPurchase']},
  createdAt: { type: Date, default: Date.now }
});

const Payment=mongoose.model.Payment || mongoose.model('Payment',PaymentSchema);
export default Payment;

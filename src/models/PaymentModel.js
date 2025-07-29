const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const PaymentSchema = new Schema({
  instituteID: { type: Types.ObjectId, ref: "Institute", required: true },
  amount: { type: Number, required: true },
  razorpayOrderID: String,
  razorpayPaymentID: String,
  verified: { type: Boolean, default: false },
  purpose: { type: String },
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

module.exports = Payment; 

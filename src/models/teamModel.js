import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phone: {
    type: String
  }
}, { _id: false });

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subEventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubEvent',
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: [MemberSchema],
    validate: [arr => arr.length > 0, 'At least one team member is required']
  },
  registrationMode: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  status: [{
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid', 'checked-in'],
    default: 'pending'
  }]
}, {
  timestamps: true
});

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export default Team;

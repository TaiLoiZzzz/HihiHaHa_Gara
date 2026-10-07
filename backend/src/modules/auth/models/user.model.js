const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    phone_number: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password_hash: { type: String, default: '123456' },
    role: {
      type: String,
      enum: ['CUSTOMER', 'SERVICE_ADVISOR', 'WORKSHOP_MANAGER', 'TECHNICIAN', 'OWNER'],
      required: true,
      default: 'CUSTOMER',
    },
    license_plate: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

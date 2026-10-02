const mongoose = require('mongoose');

// schema quan ly thong tin khach hang va ho so xe
const CustomerSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    phone_number: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    vehicles_owned: [
      {
        license_plate: { type: String, required: true },
        model_name: { type: String },
        vin: { type: String },
      },
    ],
    total_spent: { type: Number, default: 0 },
    vip_rank: { type: String, enum: ['STANDARD', 'SILVER', 'GOLD', 'DIAMOND'], default: 'STANDARD' },
    audit_logs: [
      {
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);

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
    vip_rank: {
      type: String,
      uppercase: true,
      enum: [
        'STANDARD',
        'SILVER',
        'GOLD',
        'PLATINUM',
        'DIAMOND',
        'Standard',
        'Silver',
        'Gold',
        'Platinum',
        'Diamond',
        'standard',
        'silver',
        'gold',
        'platinum',
        'diamond',
      ],
      default: 'STANDARD',
    },
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

CustomerSchema.pre('validate', function () {
  if (this.vip_rank) {
    this.vip_rank = this.vip_rank.toUpperCase();
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);

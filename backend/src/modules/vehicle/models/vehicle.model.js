const mongoose = require('mongoose');

// schema quan ly xe va so bao duong tron doi
const VehicleSchema = new mongoose.Schema(
  {
    license_plate: { type: String, required: true, index: true, uppercase: true },
    vin: { type: String, required: true, unique: true, index: true, uppercase: true },
    model_name: { type: String, required: true },
    manufacture_year: { type: Number, required: true },
    current_odo: { type: Number, required: true, default: 0 },
    customer_phone: { type: String, required: true, index: true },
    service_history: [
      {
        order_code: { type: String, required: true },
        service_date: { type: Date, default: Date.now },
        odo_at_service: { type: Number },
        total_amount: { type: Number },
        summary: { type: String },
        technician_name: { type: String },
      },
    ],
    ownership_transfer_history: [
      {
        transfer_date: { type: Date, default: Date.now },
        previous_owner_phone: { type: String },
        new_owner_phone: { type: String },
        previous_license_plate: { type: String },
        new_license_plate: { type: String },
        authorized_by: { type: String },
        verified_document: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);

const mongoose = require('mongoose');

// schema quan ly kho phu tung va lich su dieu chinh ton kho
const InventoryItemSchema = new mongoose.Schema(
  {
    part_code: { type: String, required: true, unique: true, index: true },
    part_name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    cost_price: { type: Number, required: true },
    retail_price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true, default: 0 },
    min_threshold: { type: Number, default: 2 },
    location_rack: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    adjustment_history: [
      {
        voucher_code: { type: String },
        adjusted_at: { type: Date, default: Date.now },
        adjusted_by: { type: String },
        previous_quantity: { type: Number },
        new_quantity: { type: Number },
        variance: { type: Number },
        reason_category: { type: String },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// tao compound text index de tim kiem sieu toc
InventoryItemSchema.index({ part_name: 'text', part_code: 'text' });

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);

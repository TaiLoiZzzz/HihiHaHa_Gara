const mongoose = require('mongoose');

// schema quan ly lenh sua chua bao gia dong va tien do khoang xuong
const WorkOrderSchema = new mongoose.Schema(
  {
    order_code: { type: String, required: true, unique: true, index: true },
    license_plate: { type: String, required: true, index: true, uppercase: true },
    customer_phone: { type: String, required: true },
    customer_name: { type: String, required: true },
    vehicle_model: { type: String, required: true },
    current_status: {
      type: String,
      enum: [
        'DRAFT',           // 1. Nháp tiếp nhận
        'INSPECTION',       // 2. Đang tháo rã kiểm tra / khám xe
        'QUOTE_SENT',       // 3. Đã phát hành bảng báo giá
        'QUOTE_APPROVED',  // 4. Khách hàng đã chốt làm dịch vụ
        'APPROVED',        // 5. Đồng bộ trạng thái phê duyệt
        'WAITING_PARTS',   // 6. Đang xuất kho phụ tùng ra khoang
        'IN_PROGRESS',     // 7. Thợ đang thi công tại cầu nâng
        'QUALITY_CHECK',   // 8. Đang kiểm định an toàn KCS / QC
        'COMPLETED',       // 9. Thi công hoàn tất 100%
        'PAYMENT_PENDING', // 10. Đang mở cổng thanh toán VNPay
        'PAID',            // 11. Giao dịch tài chính hoàn tất
        'DELIVERED',       // 12. Xe đã xuất xưởng bàn giao khách
        'CANCELLED',       // 13. Hủy lệnh (hoàn trả vật tư về kệ)
      ],
      default: 'DRAFT',
    },
    payment_status: {
      type: String,
      enum: ['UNPAID', 'PENDING', 'PAID'],
      default: 'UNPAID',
    },
    progress_percent: { type: Number, default: 0 },
    paid_at: { type: Date },
    assigned_technicians: [
      {
        technician_id: { type: String, required: true },
        technician_name: { type: String },
        assigned_at: { type: Date, default: Date.now },
      },
    ],
    estimate: {
      approval_status: {
        type: String,
        enum: ['PENDING_CUSTOMER', 'APPROVED', 'REJECTED'],
        default: 'PENDING_CUSTOMER',
      },
      approved_at: { type: Date },
      subtotal_labor: { type: Number, default: 0 },
      subtotal_parts: { type: Number, default: 0 },
      pretax_amount: { type: Number, default: 0 },
      vat_amount: { type: Number, default: 0 },
      total_amount: { type: Number, default: 0 },
      items: [
        {
          part_code: { type: String },
          name: { type: String, required: true },
          type: { type: String, enum: ['LABOR', 'PART'], required: true },
          quantity: { type: Number, required: true, default: 1 },
          unit_price: { type: Number, required: true },
          total_price: { type: Number, required: true },
          selected: { type: Boolean, default: true },
        },
      ],
    },
    inspection_photos: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        uploaded_at: { type: Date, default: Date.now },
      },
    ],
    workflow_timeline: [
      {
        status: { type: String, required: true },
        updated_by: { type: String, required: true },
        updated_at: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// compound index de tra cuu nhanh theo xe va trang thai
WorkOrderSchema.index({ license_plate: 1, current_status: 1 });

module.exports = mongoose.model('WorkOrder', WorkOrderSchema);

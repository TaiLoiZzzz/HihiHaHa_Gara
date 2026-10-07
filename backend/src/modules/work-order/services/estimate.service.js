const calculateEstimateService = (items = []) => {
  let subtotal_labor = 0; // Biến tích lũy: Tổng tiền công thợ
  let subtotal_parts = 0; // Biến tích lũy: Tổng tiền phụ tùng linh kiện

  // 1. DUYỆT TỪNG HẠNG MỤC TRONG BÁO GIÁ
  const processedItems = items.map((item) => {
    const qty = Number(item.quantity) || 1;          // Số lượng (mặc định là 1)
    const price = Number(item.unit_price) || 0;       // Đơn giá
    const total = qty * price;                       // Thành tiền của hạng mục này
    const isSelected = item.selected !== false;       // Khách có chọn hay bỏ chọn?

    // 2. CHỈ TÍNH TIỀN CHO MỤC NÀO ĐƯỢC CHỌN (isSelected === true)
    if (isSelected) {
      if (item.type === 'LABOR') {
        subtotal_labor += total; // Gom vào nhóm Tiền Công
      } else {
        subtotal_parts += total; // Gom vào nhóm Phụ Tùng
      }
    }

    return {
      part_code: item.part_code || null,
      name: item.name,
      type: item.type,
      quantity: qty,
      unit_price: price,
      total_price: total,
      selected: isSelected,
    };
  });

  // 3. TỔNG HỢP VÀ TÍNH THUẾ THEO LUẬT THUẾ GTGT VIỆT NAM
  const pretax_amount = subtotal_labor + subtotal_parts;     // Tổng trước thuế
  const vat_amount = Math.round(pretax_amount * 0.08);       // Thuế VAT 8% (làm tròn số nguyên)
  const total_amount = pretax_amount + vat_amount;           // Tổng thanh toán cuối cùng

  return {
    approval_status: 'PENDING_CUSTOMER',
    subtotal_labor,
    subtotal_parts,
    pretax_amount,
    vat_amount,
    total_amount,
    items: processedItems,
  };
};

module.exports = {
  calculateEstimateService,
};

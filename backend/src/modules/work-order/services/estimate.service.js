// service tinh toan bao gia dong (step 97 & step 98)
const calculateEstimateService = (items = []) => {
  let subtotal_labor = 0;
  let subtotal_parts = 0;

  const processedItems = items.map((item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unit_price) || 0;
    const total = qty * price;
    const isSelected = item.selected !== false;

    if (isSelected) {
      if (item.type === 'LABOR') {
        subtotal_labor += total;
      } else {
        subtotal_parts += total;
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

  const pretax_amount = subtotal_labor + subtotal_parts;
  const vat_amount = Math.round(pretax_amount * 0.08); // vat 8%
  const total_amount = pretax_amount + vat_amount;

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

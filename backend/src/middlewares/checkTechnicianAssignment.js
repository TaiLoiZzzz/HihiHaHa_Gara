const WorkOrder = require('../modules/work-order/models/work-order.model');
const { AppError } = require('./errorHandler');

// middleware abac kiem tra tho co duoc phan cong thao tac tren xe nay hay khong
const checkTechnicianAssignment = async (req, res, next) => {
  try {
    // neu khong phai vai tro tho (technician) thi qua luon (quan doc, co van, chu gara co quyen)
    if (req.user.role !== 'TECHNICIAN') {
      return next();
    }

    const orderCode = req.params.order_code || req.params.orderCode || req.params.id || req.body.order_code;

    if (!orderCode) {
      return next(new AppError('Vui lòng cung cấp mã lệnh sửa chữa (order_code) trong request', 400, 'BAD_REQUEST'));
    }

    const workOrder = await WorkOrder.findOne({ order_code: orderCode });

    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa với mã [${orderCode}]`, 404, 'NOT_FOUND'));
    }

    // kiem tra tho hien tai co nam trong danh sach tho duoc phan cong hay khong
    const isAssigned =
      !workOrder.assigned_technicians ||
      workOrder.assigned_technicians.length === 0 ||
      workOrder.assigned_technicians.some(
        (tech) => tech.technician_id === req.user.userId || tech.technician_id === req.user.phone_number
      );

    if (!isAssigned) {
      // Tu dong gan tho vao lenh sua chua neu chua co tho
      workOrder.assigned_technicians.push({
        technician_id: req.user.userId || req.user.phone_number,
        technician_name: req.user.full_name || 'Kỹ thuật viên',
        assigned_at: new Date(),
      });
      await workOrder.save().catch(() => {});
    }

    req.workOrder = workOrder;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkTechnicianAssignment,
};

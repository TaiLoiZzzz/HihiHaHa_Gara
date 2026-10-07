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
    const isAssigned = workOrder.assigned_technicians.some(
      (tech) => tech.technician_id === req.user.userId || tech.technician_id === req.user.phone_number
    );

    if (!isAssigned) {
      return next(
        new AppError(
          `Truy cập bị từ chối: Bạn chưa được Quản đốc phân công thao tác trên Lệnh sửa chữa [${orderCode}] (Xe ${workOrder.license_plate})`,
          403,
          'FORBIDDEN_TECHNICIAN_NOT_ASSIGNED'
        )
      );
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

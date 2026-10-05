const WorkOrder = require('../models/work-order.model');
const { calculateEstimateService } = require('../services/estimate.service');
const { sendSuccess } = require('../../../utils/response');
const { AppError } = require('../../../middlewares/errorHandler');

// map trang thai hop le theo qui trinh gara (state machine guard)
const ALLOWED_TRANSITIONS = {
  DRAFT: ['INSPECTION', 'QUOTE_SENT', 'CANCELLED'],
  INSPECTION: ['QUOTE_SENT', 'CANCELLED'],
  QUOTE_SENT: ['QUOTE_APPROVED', 'APPROVED', 'CANCELLED'],
  QUOTE_APPROVED: ['WAITING_PARTS', 'IN_PROGRESS', 'CANCELLED'],
  APPROVED: ['WAITING_PARTS', 'IN_PROGRESS', 'CANCELLED'],
  WAITING_PARTS: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['QUALITY_CHECK', 'COMPLETED', 'CANCELLED'],
  QUALITY_CHECK: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['PAYMENT_PENDING', 'PAID', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'CANCELLED'],
  PAID: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

// step 96: tao lenh sua chua moi voi ma WO-YYYYMMDD-XXXX
const createWorkOrderController = async (req, res, next) => {
  try {
    const { license_plate, customer_phone, customer_name, vehicle_model, items } = req.body;

    if (!license_plate || !customer_phone) {
      return next(new AppError('Vui lòng nhập đầy đủ biển số xe và số điện thoại khách hàng', 400, 'BAD_REQUEST'));
    }

    const normalizedPlate = license_plate.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedPhone = customer_phone.trim().replace(/\s+/g, '');

    // sinh ma lenh WO-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_code = `WO-${dateStr}-${randomSuffix}`;

    // step 97 & step 98: tinh toan bao gia dong & vat 8%
    const estimateData = calculateEstimateService(items || []);

    // step 99: luu tru bao gia nhung vao workorder mongodb (current_status = QUOTE_SENT)
    const initialStatus = items && items.length > 0 ? 'QUOTE_SENT' : 'DRAFT';

    const workOrder = await WorkOrder.create({
      order_code,
      license_plate: normalizedPlate,
      customer_phone: normalizedPhone,
      customer_name: customer_name || 'Khách hàng',
      vehicle_model: vehicle_model || 'Toyota Camry 2.5Q',
      current_status: initialStatus,
      estimate: estimateData,
      workflow_timeline: [
        {
          status: initialStatus,
          updated_by: req.user?.phone_number || 'SERVICE_ADVISOR',
          note: 'Khởi tạo Lệnh sửa chữa và nhúng bảng báo giá thành công',
        },
      ],
    });

    return sendSuccess(res, workOrder, 'Khởi tạo Lệnh sửa chữa và lập báo giá thành công', 201);
  } catch (err) {
    next(err);
  }
};

// step 100: xem chi tiet lenh sua chua theo order_code
const getWorkOrderDetailsController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const workOrder = await WorkOrder.findOne({ order_code });

    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    // bao ve quyen rieng tu: khach hang chi duoc xem lenh cua xe minh phu trách
    if (req.user && req.user.role === 'CUSTOMER') {
      const userPlate = req.user.license_plate;
      if (userPlate && workOrder.license_plate !== userPlate) {
        return next(new AppError('Bạn không có quyền truy cập Lệnh sửa chữa này', 403, 'FORBIDDEN'));
      }
    }

    return sendSuccess(res, workOrder, 'Lấy thông tin Lệnh sửa chữa thành công');
  } catch (err) {
    next(err);
  }
};

// cap nhat bao gia dong tu phia co van dich vu
const updateEstimateItemsController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { items } = req.body;

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    const estimateData = calculateEstimateService(items || []);
    workOrder.estimate = estimateData;
    workOrder.current_status = 'QUOTE_SENT';
    workOrder.workflow_timeline.push({
      status: 'QUOTE_SENT',
      updated_by: req.user?.phone_number || 'SERVICE_ADVISOR',
      note: 'Cập nhật bảng báo giá dịch vụ gửi khách hàng',
    });

    await workOrder.save();

    return sendSuccess(res, workOrder, 'Cập nhật bảng báo giá dịch vụ thành công');
  } catch (err) {
    next(err);
  }
};

// truy van danh sach lenh theo xe / sdt
const getCustomerWorkOrdersController = async (req, res, next) => {
  try {
    const license_plate = req.user?.license_plate || req.query.license_plate;
    const phone_number = req.user?.phone_number || req.query.phone_number;

    const query = {};
    if (license_plate) query.license_plate = license_plate.trim().toUpperCase();
    if (phone_number) query.customer_phone = phone_number.trim();

    const workOrders = await WorkOrder.find(query).sort({ createdAt: -1 });

    return sendSuccess(res, workOrders, 'Lấy danh sách Lệnh sửa chữa thành công');
  } catch (err) {
    next(err);
  }
};

// khach hang phe duyet bao gia (step 102 - 103)
const customerApproveEstimateController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { selected_item_codes } = req.body;

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    // kiem tra chuyen trang thai hop le
    const currentStatus = workOrder.current_status;
    const nextStatus = 'QUOTE_APPROVED';
    if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(nextStatus) && !ALLOWED_TRANSITIONS[currentStatus]?.includes('APPROVED')) {
      return next(
        new AppError(
          `Không thể chuyển trạng thái từ [${currentStatus}] sang [${nextStatus}]`,
          400,
          'INVALID_STATUS_TRANSITION'
        )
      );
    }

    // cap nhat cac muc duoc chon
    if (Array.isArray(selected_item_codes)) {
      workOrder.estimate.items.forEach((item) => {
        if (item.part_code) {
          item.selected = selected_item_codes.includes(item.part_code);
        }
      });
    }

    // tinh toan lai vat va tong tien sau khi khach chot hang muc
    const updatedEstimate = calculateEstimateService(workOrder.estimate.items);
    updatedEstimate.approval_status = 'APPROVED';
    updatedEstimate.approved_at = new Date();
    workOrder.estimate = updatedEstimate;

    workOrder.current_status = 'QUOTE_APPROVED';
    workOrder.workflow_timeline.push({
      status: 'QUOTE_APPROVED',
      updated_by: req.user?.phone_number || 'CUSTOMER',
      note: 'Khách hàng đã ký duyệt Báo giá dịch vụ',
    });

    await workOrder.save();

    return sendSuccess(res, workOrder, 'Khách hàng phê duyệt báo giá thành công');
  } catch (err) {
    next(err);
  }
};

// cap nhat trang thai lenh theo state machine guard
const updateWorkOrderStatusController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { next_status, note } = req.body;

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    const currentStatus = workOrder.current_status;
    if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(next_status)) {
      return next(
        new AppError(
          `Không thể chuyển trạng thái Lệnh sửa chữa từ [${currentStatus}] sang [${next_status}]`,
          400,
          'INVALID_STATUS_TRANSITION'
        )
      );
    }

    workOrder.current_status = next_status;
    workOrder.workflow_timeline.push({
      status: next_status,
      updated_by: req.user?.phone_number || 'STAFF',
      note: note || `Chuyển trạng thái sang ${next_status}`,
    });

    await workOrder.save();

    return sendSuccess(res, workOrder, `Cập nhật trạng thái sang ${next_status} thành công`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createWorkOrderController,
  getWorkOrderDetailsController,
  updateEstimateItemsController,
  getCustomerWorkOrdersController,
  customerApproveEstimateController,
  updateWorkOrderStatusController,
};

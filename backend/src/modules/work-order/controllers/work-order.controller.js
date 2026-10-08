const WorkOrder = require('../models/work-order.model');
const Customer = require('../../auth/models/customer.model');
const { sendIntakeConfirmationEmail } = require('../../auth/services/email.service');
const { calculateEstimateService } = require('../services/estimate.service');
const { allocatePartsService, deallocatePartsService } = require('../../inventory/services/inventory.service');
const { broadcastProgressUpdated } = require('../../../sockets');
const { sendSuccess } = require('../../../utils/response');
const { AppError } = require('../../../middlewares/errorHandler');

// map trang thai hop le theo qui trinh gara (step 101 state machine guard)
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
    const { license_plate, customer_phone, customer_name, customer_email, vehicle_model, items } = req.body;

    if (!license_plate || !customer_phone) {
      return next(new AppError('Vui lòng nhập đầy đủ biển số xe và số điện thoại khách hàng', 400, 'BAD_REQUEST'));
    }

    const normalizedPlate = license_plate.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedPhone = customer_phone.trim().replace(/\s+/g, '');
    const cleanEmail = customer_email?.trim().toLowerCase();

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_code = `WO-${dateStr}-${randomSuffix}`;

    const estimateData = calculateEstimateService(items || []);
    const initialStatus = items && items.length > 0 ? 'QUOTE_SENT' : 'DRAFT';

    const workOrder = await WorkOrder.create({
      order_code,
      license_plate: normalizedPlate,
      customer_phone: normalizedPhone,
      customer_name: customer_name || 'Khách hàng',
      customer_email: cleanEmail,
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

    // Dong bo ho so khach hang & xe vao MongoDB Customer collection (dong thoi tao tai khoan chu xe)
    try {
      let existingCust = await Customer.findOne({
        $or: [
          { phone_number: normalizedPhone },
          { 'vehicles_owned.license_plate': normalizedPlate },
        ],
      });

      const effectiveEmail = cleanEmail || existingCust?.email || 'tailoi1606@gmail.com';

      if (existingCust) {
        if (cleanEmail) existingCust.email = cleanEmail;
        if (customer_name?.trim()) existingCust.full_name = customer_name.trim();
        const hasPlate = existingCust.vehicles_owned?.some(v => v.license_plate === normalizedPlate);
        if (!hasPlate) {
          existingCust.vehicles_owned.push({
            license_plate: normalizedPlate,
            model_name: vehicle_model || 'Xe dịch vụ',
            vin: 'VN' + Date.now().toString().slice(-8),
          });
        }
        existingCust.audit_logs.push({
          action: 'INTAKE_BY_ADVISOR',
          timestamp: new Date(),
          details: `Cố vấn tạo Lệnh sửa chữa #${order_code} cho xe ${normalizedPlate}. Cập nhật hồ sơ tài khoản.`,
        });
        await existingCust.save();
      } else {
        await Customer.create({
          full_name: customer_name?.trim() || 'Khách Hàng',
          phone_number: normalizedPhone,
          email: effectiveEmail,
          vehicles_owned: [
            {
              license_plate: normalizedPlate,
              model_name: vehicle_model || 'Toyota Camry 2.5Q',
              vin: 'VN' + Date.now().toString().slice(-8),
            },
          ],
          audit_logs: [
            {
              action: 'ACCOUNT_CREATED_BY_ADVISOR',
              timestamp: new Date(),
              details: `Tài khoản chủ xe được khởi tạo tự động bởi Cố vấn dịch vụ khi tiếp nhận xe ${normalizedPlate} (Lệnh #${order_code}).`,
            },
          ],
        });
      }

      // Gui email thong bao tiep nhan xe & kich hoat tai khoan qua Gmail SMTP thuc te
      if (effectiveEmail) {
        sendIntakeConfirmationEmail({
          recipientEmail: effectiveEmail,
          customerName: customer_name?.trim() || 'Quý khách',
          licensePlate: normalizedPlate,
          vehicleModel: vehicle_model || 'Xe dịch vụ',
          orderCode: order_code,
          phone: normalizedPhone,
        }).catch((e) => console.error('Lỗi gửi email tiếp nhận:', e.message));
      }
    } catch (custErr) {
      console.warn('Lỗi đồng bộ hồ sơ khách hàng khi tạo lệnh:', custErr.message);
    }

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

// truy van danh sach lenh theo xe / sdt hoac toan bo lenh cho nhan vien
const getCustomerWorkOrdersController = async (req, res, next) => {
  try {
    const isCustomer = req.user?.role === 'CUSTOMER';
    const query = {};

    if (isCustomer) {
      const license_plate = req.user?.license_plate || req.query.license_plate;
      const phone_number = req.user?.phone_number || req.query.phone_number;
      if (license_plate && phone_number) {
        query.$or = [
          { license_plate: license_plate.trim().toUpperCase() },
          { customer_phone: phone_number.trim() },
        ];
      } else if (license_plate) {
        query.license_plate = license_plate.trim().toUpperCase();
      } else if (phone_number) {
        query.customer_phone = phone_number.trim();
      }
    } else {
      // Nhan vien (Advisor, Manager, Technician, Owner) neu co query param thi loc, khong thi lay tat ca
      if (req.query.license_plate) {
        query.license_plate = req.query.license_plate.trim().toUpperCase();
      }
      if (req.query.customer_phone) {
        query.customer_phone = req.query.customer_phone.trim();
      }
    }

    const workOrders = await WorkOrder.find(query).sort({ createdAt: -1 });

    return sendSuccess(res, workOrders, 'Lấy danh sách Lệnh sửa chữa thành công');
  } catch (err) {
    next(err);
  }
};

// step 102 - 112: khach hang phe duyet bao gia & cap phat kho bang redis redlock mutex
const customerApproveEstimateController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { selected_item_codes } = req.body;

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

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

    if (Array.isArray(selected_item_codes)) {
      workOrder.estimate.items.forEach((item) => {
        if (item.part_code) {
          item.selected = selected_item_codes.includes(item.part_code);
        }
      });
    }

    const updatedEstimate = calculateEstimateService(workOrder.estimate.items);
    updatedEstimate.approval_status = 'APPROVED';
    updatedEstimate.approved_at = new Date();
    workOrder.estimate = updatedEstimate;

    // step 107 - 112: thuc hien cap phat phu tung an toan bang redis redlock mutex
    const allocResult = await allocatePartsService(order_code, workOrder.estimate.items);

    workOrder.current_status = 'WAITING_PARTS';
    workOrder.workflow_timeline.push({
      status: 'WAITING_PARTS',
      updated_by: req.user?.phone_number || 'CUSTOMER',
      note: `Khách hàng phê duyệt báo giá. Đã cấp phát ${allocResult.allocatedParts?.length || 0} phụ tùng qua Redis Redlock`,
    });

    await workOrder.save();

    const io = req.app.get('socketio');
    if (io) {
      io.to('room:advisors').emit('QUOTE_APPROVED_EVENT', {
        order_code,
        license_plate: workOrder.license_plate,
        approved_at: updatedEstimate.approved_at,
        total_amount: updatedEstimate.total_amount,
        allocated_parts: allocResult.allocatedParts,
      });
    }

    return sendSuccess(res, workOrder, 'Khách hàng phê duyệt báo giá & cấp phát kho an toàn thành công');
  } catch (err) {
    next(err);
  }
};

// cap nhat trang thai lenh theo state machine guard (cho quan doc / ky thuat vien)
const updateWorkOrderStatusController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { next_status, note } = req.body;

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    const currentStatus = workOrder.current_status;
    const isManagerOrOwner = req.user?.role === 'WORKSHOP_MANAGER' || req.user?.role === 'OWNER';
    if (!isManagerOrOwner && !ALLOWED_TRANSITIONS[currentStatus]?.includes(next_status)) {
      return next(
        new AppError(
          `Không thể chuyển trạng thái Lệnh sửa chữa từ [${currentStatus}] sang [${next_status}]`,
          400,
          'INVALID_STATUS_TRANSITION'
        )
      );
    }

    // step 113: neu chuyen sang CANCELLED thi tu dong hoan tra ton kho
    if (next_status === 'CANCELLED') {
      await deallocatePartsService(order_code, workOrder.estimate?.items || []);
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

// step 138 - 140: controller ky thuat vien cap nhat tien do thi cong & anh nghiem thu (UC-04)
const updateProgressController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { stage_name, percent_complete, photo_urls = [], note, tasks } = req.body;

    if (!stage_name) {
      return next(new AppError('Vui lòng cung cấp tên công đoạn thi công stage_name', 400, 'BAD_REQUEST'));
    }

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    // Luu checklist cong viec tasks vao MongoDB
    if (Array.isArray(tasks) && tasks.length > 0) {
      workOrder.tasks = tasks;
    }

    // step 139: luu vet vao mang inspection_photos va workflow_timeline trong mongodb
    if (Array.isArray(photo_urls) && photo_urls.length > 0) {
      for (const pUrl of photo_urls) {
        workOrder.inspection_photos.push({
          url: typeof pUrl === 'string' ? pUrl : pUrl.url,
          caption: typeof pUrl === 'object' ? pUrl.caption : `Ảnh công đoạn ${stage_name}`,
          uploaded_at: new Date(),
        });
      }
    }

    const progressNote = note || `Thi công công đoạn [${stage_name}] hoàn thành ${percent_complete || 100}%`;
    if (percent_complete !== undefined) {
      workOrder.progress_percent = Number(percent_complete);
    }
    workOrder.workflow_timeline.push({
      status: workOrder.current_status,
      updated_by: req.user?.phone_number || 'TECHNICIAN',
      updated_at: new Date(),
      note: progressNote,
    });

    await workOrder.save();

    // step 140: ban su kien realtime PROGRESS_UPDATED toi room:order va room:kanban
    broadcastProgressUpdated(order_code, {
      stage_name,
      percent_complete: percent_complete || 100,
      inspection_photos: workOrder.inspection_photos,
      updated_by: req.user?.phone_number || 'TECHNICIAN',
      note: progressNote,
    });

    return sendSuccess(
      res,
      {
        order_code,
        stage_name,
        percent_complete: percent_complete || 100,
        inspection_photos: workOrder.inspection_photos,
        timeline: workOrder.workflow_timeline,
      },
      `Cập nhật tiến độ công đoạn [${stage_name}] và phát tín hiệu Realtime thành công!`
    );
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
  updateProgressController,
};

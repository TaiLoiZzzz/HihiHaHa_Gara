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
    // Quy chuan tiep nhan xe gara 4S: Xe vua vao xuong la INSPECTION (Tiep nhan xe - Cot 1 Kanban)
    const initialStatus = 'INSPECTION';

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
      const userPhone = req.user.phone_number;
      const userPlate = req.user.license_plate;
      const isOwner = (userPhone && workOrder.customer_phone === userPhone) ||
                      (userPlate && workOrder.license_plate === userPlate);
      if (!isOwner) {
        const cust = await Customer.findOne({
          phone_number: userPhone,
          'vehicles_owned.license_plate': workOrder.license_plate,
        });
        if (!cust) {
          return next(new AppError('Bạn không có quyền truy cập Lệnh sửa chữa này', 403, 'FORBIDDEN'));
        }
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
      if (req.query.technician_id) {
        const tid = req.query.technician_id.trim();
        query['assigned_technicians'] = {
          $elemMatch: {
            $or: [
              { technician_id: tid },
              { technician_name: new RegExp(tid, 'i') },
            ],
          },
        };
      } else if (req.user?.role === 'TECHNICIAN' && !req.query.all) {
        query['assigned_technicians'] = {
          $elemMatch: {
            $or: [
              { technician_id: req.user.phone_number },
              { technician_name: new RegExp(req.user.full_name || '', 'i') },
            ],
          },
        };
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

    // 1. Kiem tra tinh hop le cua luong State Machine
    if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(next_status) && currentStatus !== next_status) {
      return next(
        new AppError(
          `Quy trình không hợp lệ: Không thể chuyển từ [${currentStatus}] sang [${next_status}]. Phải tuân thủ đúng trình tự quy trình!`,
          400,
          'INVALID_STATUS_TRANSITION'
        )
      );
    }

    // 2. CAC RANG BUOC NGHIEP VU CHAT CHE (BUSINESS GUARDS):
    // Dieu kien sang QUOTE_SENT (Cho duyet bao gia): Phai co it nhat 1 hang muc bao gia
    if (next_status === 'QUOTE_SENT') {
      const itemsCount = workOrder.estimate?.items?.length || 0;
      if (itemsCount === 0) {
        return next(
          new AppError(
            'Chưa có hạng mục báo giá nào. Vui lòng lập danh sách vật tư/tiền công trước khi phát hành báo giá!',
            400,
            'EMPTY_ESTIMATE'
          )
        );
      }
    }

    // Dieu kien sang QUOTE_APPROVED / WAITING_PARTS: Khach hang phai ky duyet bao gia
    if (next_status === 'QUOTE_APPROVED' || next_status === 'APPROVED' || next_status === 'WAITING_PARTS') {
      if (workOrder.estimate?.approval_status !== 'APPROVED') {
        return next(
          new AppError(
            'Khách hàng chưa ký duyệt bảng báo giá. Không thể tự ý chuyển sang bước Đã duyệt!',
            400,
            'CUSTOMER_NOT_APPROVED'
          )
        );
      }
    }

    // Dieu kien sang IN_PROGRESS (Dang thi cong): Phai co Thợ và Khoang nang
    if (next_status === 'IN_PROGRESS') {
      const hasTech = Array.isArray(workOrder.assigned_technicians) && workOrder.assigned_technicians.length > 0;
      const hasBay = workOrder.bay && workOrder.bay !== 'Chưa xếp khoang';
      if (!hasTech || !hasBay) {
        return next(
          new AppError(
            'Chưa đủ điều kiện thi công: Vui lòng phân công Kỹ thuật viên và Khoang nâng cho lệnh này trước!',
            400,
            'MISSING_TECH_OR_BAY'
          )
        );
      }
    }

    // Dieu kien sang QUALITY_CHECK / COMPLETED: Phai hoan thanh 100% cong doan
    if (next_status === 'QUALITY_CHECK' || next_status === 'COMPLETED') {
      const isProgress100 = (workOrder.progress_percent || 0) >= 100;
      const hasTasks = Array.isArray(workOrder.tasks) && workOrder.tasks.length > 0;
      const allTasksDone = hasTasks ? workOrder.tasks.every((t) => t.status === 'done') : isProgress100;

      if (!isProgress100 && !allTasksDone) {
        return next(
          new AppError(
            `Chưa đủ điều kiện hoàn tất: Kỹ thuật viên chưa hoàn thành 100% công đoạn thi công tại khoang (Tiến độ: ${workOrder.progress_percent || 0}%). Không thể kéo sang Hoàn tất!`,
            400,
            'TASKS_NOT_COMPLETED'
          )
        );
      }
    }

    // Dieu kien sang PAID: Phai thanh toan xong
    if (next_status === 'PAID') {
      if (workOrder.payment_status !== 'PAID') {
        return next(
          new AppError(
            'Lệnh sửa chữa chưa được ghi nhận thanh toán thành công qua cổng thanh toán.',
            400,
            'PAYMENT_NOT_VERIFIED'
          )
        );
      }
    }

    // step 113: neu chuyen sang CANCELLED thi tu dong hoan tra ton kho
    if (next_status === 'CANCELLED') {
      await deallocatePartsService(order_code, workOrder.estimate?.items || []);
    }

    workOrder.current_status = next_status;
    workOrder.workflow_timeline.push({
      status: next_status,
      updated_by: req.user?.full_name || req.user?.phone_number || 'QUẢN ĐỐC',
      updated_at: new Date(),
      note: note || `Quản đốc chuyển trạng thái sang ${next_status}`,
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

    // 1. Chan tuyet doi viec sua doi cong doan khi lenh da quyet toan thanh toan
    if (workOrder.payment_status === 'PAID' || workOrder.current_status === 'PAID' || workOrder.current_status === 'DELIVERED') {
      return next(new AppError(
        'Lệnh sửa chữa đã hoàn tất quyết toán thanh toán (PAID). Hồ sơ kỹ thuật đã đóng, không thể tiếp tục chỉnh sửa hoặc cập nhật công đoạn thi công.',
        400,
        'ORDER_ALREADY_PAID'
      ));
    }

    // 2. Luu checklist cong viec tasks vao MongoDB
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

    const progressVal = percent_complete !== undefined ? Number(percent_complete) : workOrder.progress_percent || 0;
    workOrder.progress_percent = progressVal;

    // Kiem tra tat ca tasks da hoan thanh 100% chua
    const hasTasks = Array.isArray(workOrder.tasks) && workOrder.tasks.length > 0;
    const allTasksDone = hasTasks ? workOrder.tasks.every((t) => t.status === 'done') : progressVal >= 100;

    const progressNote = note || `Thi công công đoạn [${stage_name}] hoàn thành ${progressVal}%`;
    workOrder.workflow_timeline.push({
      status: workOrder.current_status,
      updated_by: req.user?.phone_number || 'TECHNICIAN',
      updated_at: new Date(),
      note: progressNote,
    });

    // Neu da hoan tat 100% tat ca cong doan va chua COMPLETED -> tu dong chuyen sang COMPLETED de mo thanh toan
    if ((allTasksDone || progressVal >= 100) && ['IN_PROGRESS', 'QUALITY_CHECK', 'WAITING_PARTS', 'QUOTE_APPROVED'].includes(workOrder.current_status)) {
      workOrder.current_status = 'COMPLETED';
      workOrder.progress_percent = 100;
      if (Array.isArray(workOrder.assigned_technicians)) {
        workOrder.assigned_technicians.forEach((t) => {
          t.completed_at = new Date();
        });
      }
      workOrder.workflow_timeline.push({
        status: 'COMPLETED',
        updated_by: req.user?.phone_number || 'TECHNICIAN',
        updated_at: new Date(),
        note: 'Kỹ thuật viên đã hoàn thành 100% tất cả các công đoạn thi công và nghiệm thu KCS đạt chuẩn. Lệnh sửa chữa chuyển sang Hoàn Tất (COMPLETED) - Sẵn sàng quyết toán thanh toán & bàn giao xe.',
      });
    } else if (['WAITING_PARTS', 'QUOTE_APPROVED'].includes(workOrder.current_status)) {
      workOrder.current_status = 'IN_PROGRESS';
    }

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

// controller quan doc phan cong ky thuat vien & khoang nang
const assignWorkOrderController = async (req, res, next) => {
  try {
    const { order_code } = req.params;
    const { technician_name, technician_id, bay, priority, estimated_time } = req.body;

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    // QUY TRÌNH CHUẨN GARA: Quản đốc chỉ được phân công Kỹ thuật viên & Khoang nâng tại bước "ĐÃ DUYỆT BÁO GIÁ / CHỜ VẬT TƯ" (hoặc điều chuyển khi đang thi công)
    const ASSIGNABLE_STATUSES = ['QUOTE_APPROVED', 'WAITING_PARTS', 'APPROVED', 'IN_PROGRESS'];
    if (!ASSIGNABLE_STATUSES.includes(workOrder.current_status)) {
      if (['DRAFT', 'INSPECTION'].includes(workOrder.current_status)) {
        return next(
          new AppError(
            `Chưa thể phân công: Xe đang ở bước Tiếp Nhận / Khám Xe. Cần lập bảng báo giá và được khách hàng duyệt trước khi Quản đốc phân công thợ và khoang nâng!`,
            400,
            'CANNOT_ASSIGN_INSPECTION_STAGE'
          )
        );
      }
      if (workOrder.current_status === 'QUOTE_SENT') {
        return next(
          new AppError(
            `Chưa thể phân công: Báo giá đang chờ khách hàng ký duyệt trực tuyến (QUOTE_SENT). Chỉ khi khách hàng đồng ý duyệt báo giá thì Quản đốc mới được phân công thợ thi công!`,
            400,
            'CANNOT_ASSIGN_PENDING_APPROVAL'
          )
        );
      }
      if (['QUALITY_CHECK', 'COMPLETED', 'PAYMENT_PENDING', 'PAID', 'DELIVERED'].includes(workOrder.current_status)) {
        return next(
          new AppError(
            `Không thể phân công: Lệnh sửa chữa đã hoàn tất thi công hoặc đang ở khâu nghiệm thu KCS / Thanh toán / Bàn giao.`,
            400,
            'CANNOT_ASSIGN_COMPLETED_STAGE'
          )
        );
      }
      return next(
        new AppError(
          `Không thể phân công thợ tại bước [${workOrder.current_status}]. Quản đốc chỉ được phân công khi xe ở bước "Đã duyệt báo giá / Chờ vật tư"!`,
          400,
          'INVALID_STAGE_FOR_ASSIGNMENT'
        )
      );
    }

    if (technician_name) {
      const techId = technician_id || '0988888803';
      const MAX_TECH_WORKLOAD = 3;

      // Kiem tra so xe dang thi cong ma tho nay dang phu trach
      const currentActiveCount = await WorkOrder.countDocuments({
        order_code: { $ne: order_code },
        'assigned_technicians.technician_id': techId,
        current_status: { $in: ['QUOTE_APPROVED', 'WAITING_PARTS', 'IN_PROGRESS', 'QUALITY_CHECK'] },
      });

      if (currentActiveCount >= MAX_TECH_WORKLOAD) {
        return next(
          new AppError(
            `Kỹ thuật viên [${technician_name}] đã đạt tải tối đa (${currentActiveCount}/${MAX_TECH_WORKLOAD} xe đang thi công). Vui lòng hoàn tất xe hiện tại hoặc chọn kỹ thuật viên khác!`,
            400,
            'TECH_WORKLOAD_LIMIT_EXCEEDED'
          )
        );
      }

      workOrder.assigned_technicians = [
        {
          technician_id: techId,
          technician_name: technician_name,
          assigned_at: new Date(),
        },
      ];
    }

    if (bay) {
      workOrder.bay = bay;
    }

    if (priority) {
      workOrder.priority = priority;
    }

    if (estimated_time) {
      workOrder.estimated_finish_time = estimated_time;
    }

    // Tu dong chuyen sang IN_PROGRESS (Dang thi cong) neu lenh da duoc duyet va da co tho + khoang
    if (['QUOTE_APPROVED', 'WAITING_PARTS', 'APPROVED'].includes(workOrder.current_status) && workOrder.bay && workOrder.bay !== 'Chưa xếp khoang') {
      workOrder.current_status = 'IN_PROGRESS';
      workOrder.workflow_timeline.push({
        status: 'IN_PROGRESS',
        updated_by: req.user?.full_name || 'QUẢN ĐỐC',
        updated_at: new Date(),
        note: `Đã phân công [${technician_name}] tại [${bay || workOrder.bay}]. Lệnh tự động chuyển sang Đang thi công (IN_PROGRESS)`,
      });
    } else {
      workOrder.workflow_timeline.push({
        status: workOrder.current_status,
        updated_by: req.user?.full_name || req.user?.phone_number || 'QUẢN ĐỐC',
        updated_at: new Date(),
        note: `Quản đốc phân công [${technician_name || 'Kỹ thuật viên'}] phụ trách tại [${bay || 'Khoang nâng'}]`,
      });
    }

    await workOrder.save();

    broadcastProgressUpdated(order_code, {
      stage_name: 'PHÂN CÔNG KHOANG NÂNG',
      percent_complete: workOrder.progress_percent || 10,
      updated_by: req.user?.full_name || 'QUẢN ĐỐC',
      note: `Đã phân công ${technician_name} tại ${bay}`,
    });

    return sendSuccess(res, workOrder, `Phân công kỹ thuật viên [${technician_name}] cho lệnh #${order_code} thành công`);
  } catch (err) {
    next(err);
  }
};

// controller truy van tai cong viec cua doi ngu ky thuat vien
const getTechniciansWorkloadController = async (req, res, next) => {
  try {
    const TECHS = [
      { id: '0988888803', name: 'Nguyễn Văn Thợ (THO-01)', role: 'Trưởng nhóm Máy & Gầm - Bậc 4/4', avatar: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=160&auto=format&fit=crop&q=80' },
      { id: '0988888804', name: 'Trần Văn Cường (THO-02)', role: 'Chuyên gia Điện - CAN-Bus & Lạnh', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&auto=format&fit=crop&q=80' },
      { id: '0988888805', name: 'Lê Hoàng Long (THO-03)', role: 'Kỹ thuật viên Bảo Dưỡng Nhanh', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80' },
      { id: '0988888806', name: 'Phạm Minh Tuấn (THO-04)', role: 'Kỹ thuật viên Cân Chỉnh Góc Đặt 3D', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80' },
    ];

    const activeOrders = await WorkOrder.find({
      current_status: { $in: ['QUOTE_APPROVED', 'WAITING_PARTS', 'IN_PROGRESS', 'QUALITY_CHECK'] },
    }).lean();

    const workload = TECHS.map((tech) => {
      const assigned = activeOrders.filter((o) =>
        o.assigned_technicians?.some((t) => t.technician_id === tech.id || t.technician_name?.includes(tech.name.split(' ')[0]))
      );
      return {
        ...tech,
        current_orders_count: assigned.length,
        max_orders: 3,
        is_full: assigned.length >= 3,
        orders: assigned.map((o) => ({
          order_code: o.order_code,
          license_plate: o.license_plate,
          bay: o.bay,
          current_status: o.current_status,
          progress_percent: o.progress_percent,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
        })),
      };
    });

    return sendSuccess(res, workload, 'Lấy báo cáo tải công việc kỹ thuật viên thành công');
  } catch (err) {
    next(err);
  }
};

// controller lay thong tin toan dien ve xe cua rieng mot ky thuat vien (Dang lam, Lich su da xong, Xe hang doi)
const getTechnicianDashboardController = async (req, res, next) => {
  try {
    const { tech_id } = req.params;
    const techId = tech_id || req.user?.phone_number;

    const techNameKeywords = {
      '0988888803': 'Thợ',
      '0988888804': 'Cường',
      '0988888805': 'Long',
      '0988888806': 'Tuấn',
    };
    const namePattern = techNameKeywords[techId] || techId;

    // 1. Xe dang phu trach thi cong (Active: 0..3 xe)
    const activeOrders = await WorkOrder.find({
      $or: [
        { 'assigned_technicians.technician_id': techId },
        { 'assigned_technicians.technician_name': new RegExp(namePattern, 'i') },
      ],
      current_status: { $in: ['QUOTE_APPROVED', 'WAITING_PARTS', 'IN_PROGRESS', 'QUALITY_CHECK'] },
    }).sort({ updatedAt: -1 }).lean();

    // 2. Lich su xe da hoan thanh cua rieng tho nay (Completed History)
    const completedOrders = await WorkOrder.find({
      $or: [
        { 'assigned_technicians.technician_id': techId },
        { 'assigned_technicians.technician_name': new RegExp(namePattern, 'i') },
      ],
      current_status: { $in: ['COMPLETED', 'PAYMENT_PENDING', 'PAID', 'DELIVERED'] },
    }).sort({ updatedAt: -1 }).lean();

    // 3. Hang doi cac xe dang cho thi cong / cho xuat vat tu trong gara (Queue)
    const waitingQueue = await WorkOrder.find({
      current_status: { $in: ['INSPECTION', 'QUOTE_SENT', 'QUOTE_APPROVED', 'WAITING_PARTS'] },
    }).sort({ createdAt: 1 }).limit(10).lean();

    // 4. Thong ke hieu suat cua tho
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCompleted = completedOrders.filter((o) => new Date(o.updatedAt) >= today);

    return sendSuccess(
      res,
      {
        active_orders: activeOrders,
        completed_orders: completedOrders,
        waiting_queue: waitingQueue,
        stats: {
          active_count: activeOrders.length,
          max_allowed: 3,
          total_completed: completedOrders.length,
          today_completed: todayCompleted.length,
        },
      },
      'Lấy thông tin điều phối & lịch sử kỹ thuật viên thành công'
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
  assignWorkOrderController,
  getTechniciansWorkloadController,
  getTechnicianDashboardController,
};

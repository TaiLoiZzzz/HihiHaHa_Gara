const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');
const { verifyToken, authorizeRoles, ROLES } = require('../../middlewares/authJwt');
const { checkTechnicianAssignment } = require('../../middlewares/checkTechnicianAssignment');
const {
  createWorkOrderController,
  getWorkOrderDetailsController,
  updateEstimateItemsController,
  getCustomerWorkOrdersController,
  customerApproveEstimateController,
  updateWorkOrderStatusController,
  updateProgressController,
  assignWorkOrderController,
  getTechniciansWorkloadController,
} = require('./controllers/work-order.controller');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'work-order' }, 'Phân hệ Lệnh sửa chữa & Báo giá (WorkOrder) đang hoạt động');
});

// tao lenh sua chua (advisor, manager, owner)
router.post(
  '/',
  verifyToken,
  authorizeRoles(ROLES.SERVICE_ADVISOR, ROLES.WORKSHOP_MANAGER, ROLES.OWNER),
  createWorkOrderController
);

// khach hang va nhan vien truy van danh sach lenh
router.get('/my-orders', verifyToken, getCustomerWorkOrdersController);

// quan doc & chu gara truy van tai cong viec cua doi ngu ky thuat vien
router.get(
  '/technicians-workload',
  verifyToken,
  authorizeRoles(ROLES.WORKSHOP_MANAGER, ROLES.OWNER, ROLES.SERVICE_ADVISOR),
  getTechniciansWorkloadController
);

// chi tiet lenh sua chua theo order_code
router.get('/:order_code', verifyToken, getWorkOrderDetailsController);

// quan doc/co van cap nhat hang muc bao gia
router.put(
  '/:order_code/estimate',
  verifyToken,
  authorizeRoles(ROLES.SERVICE_ADVISOR, ROLES.WORKSHOP_MANAGER, ROLES.OWNER),
  updateEstimateItemsController
);

// khach hang ky duyet bao gia
router.post(
  '/:order_code/approve-estimate',
  verifyToken,
  authorizeRoles(ROLES.CUSTOMER, ROLES.SERVICE_ADVISOR, ROLES.WORKSHOP_MANAGER, ROLES.OWNER),
  customerApproveEstimateController
);

// chuyen trang thai lenh theo state machine guard
router.patch(
  '/:order_code/status',
  verifyToken,
  authorizeRoles(ROLES.SERVICE_ADVISOR, ROLES.WORKSHOP_MANAGER, ROLES.TECHNICIAN, ROLES.OWNER),
  updateWorkOrderStatusController
);

// ky thuat vien cap nhat tien do & anh nghiem thu thi cong khoang xuong (UC-04)
router.post(
  '/:order_code/progress',
  verifyToken,
  authorizeRoles(ROLES.TECHNICIAN, ROLES.WORKSHOP_MANAGER, ROLES.SERVICE_ADVISOR, ROLES.OWNER),
  updateProgressController
);

// quan doc phan cong ky thuat vien va khoang nang (Kanban)
router.patch(
  '/:order_code/assign',
  verifyToken,
  authorizeRoles(ROLES.WORKSHOP_MANAGER, ROLES.SERVICE_ADVISOR, ROLES.OWNER),
  assignWorkOrderController
);

module.exports = router;

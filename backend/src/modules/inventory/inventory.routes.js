const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');
const { verifyToken, authorizeRoles, ROLES } = require('../../middlewares/authJwt');
const {
  createPartController,
  updatePartController,
  deletePartController,
  createStockAdjustmentController,
  getInventoryItemsController,
} = require('./controllers/inventory.controller');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'inventory' }, 'Phân hệ Quản lý Kho & Tồn Kho (Inventory) đang hoạt động');
});

// danh sach kho
router.get('/', verifyToken, getInventoryItemsController);

// them moi phu tung vao kho (thuu kho, owner)
router.post(
  '/',
  verifyToken,
  authorizeRoles(ROLES.WAREHOUSE_KEEPER, ROLES.OWNER),
  createPartController
);

// phieu kiem ke & dieu chinh ton kho (thuu kho, owner)
router.post(
  '/adjustments',
  verifyToken,
  authorizeRoles(ROLES.WAREHOUSE_KEEPER, ROLES.OWNER),
  createStockAdjustmentController
);

// cap nhat phu tung
router.put(
  '/:part_code',
  verifyToken,
  authorizeRoles(ROLES.WAREHOUSE_KEEPER, ROLES.OWNER),
  updatePartController
);

// xoa mem phu tung
router.delete(
  '/:part_code',
  verifyToken,
  authorizeRoles(ROLES.WAREHOUSE_KEEPER, ROLES.OWNER),
  deletePartController
);

module.exports = router;

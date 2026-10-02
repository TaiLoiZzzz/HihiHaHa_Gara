const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'work-order' }, 'Phân hệ Lệnh sửa chữa & Báo giá (WorkOrder) đang hoạt động');
});

module.exports = router;

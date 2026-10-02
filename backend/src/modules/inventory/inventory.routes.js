const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'inventory' }, 'Phân hệ Kho phụ tùng & Search (Inventory) đang hoạt động');
});

module.exports = router;

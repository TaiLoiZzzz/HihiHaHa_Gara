const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'payment' }, 'Phân hệ Thanh toán VNPay & Outbox (Payment) đang hoạt động');
});

module.exports = router;

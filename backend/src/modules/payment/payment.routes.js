const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');
const { verifyToken } = require('../../middlewares/authJwt');
const {
  createPaymentUrlController,
  vnpayIpnController,
  vnpayReturnController,
} = require('./controllers/payment.controller');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'payment' }, 'Phân hệ Thanh toán VNPay & Outbox (Payment) đang hoạt động');
});

// khoi tao URL thanh toan VietQR VNPay
router.post('/create-payment-url', verifyToken, createPaymentUrlController);

// IPN Webhook tu vnpay sandbox (Server-to-Server)
router.get('/vnpay_ipn', vnpayIpnController);

// Trang return sau khi thanh toan tren web vnpay
router.get('/vnpay_return', vnpayReturnController);

module.exports = router;

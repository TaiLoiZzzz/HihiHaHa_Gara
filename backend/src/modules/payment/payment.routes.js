const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');
const { verifyToken, authorizeRoles, ROLES } = require('../../middlewares/authJwt');
const {
  createPaymentUrlController,
  vnpayIpnController,
  vnpayReturnController,
  confirmPaymentController,
} = require('./controllers/payment.controller');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'payment' }, 'Phân hệ Thanh toán VNPay & Outbox (Payment) đang hoạt động');
});

// xac nhan thanh toan truc tiep (VietQR / Ngan hang)
router.post(
  '/confirm',
  verifyToken,
  authorizeRoles(ROLES.CUSTOMER, ROLES.SERVICE_ADVISOR, ROLES.WORKSHOP_MANAGER, ROLES.OWNER),
  confirmPaymentController
);

// khoi tao URL thanh toan VietQR VNPay (Danh cho Khach hang, Co van, Quan doc, Chu gara)
router.post(
  '/create-payment-url',
  verifyToken,
  authorizeRoles(ROLES.CUSTOMER, ROLES.SERVICE_ADVISOR, ROLES.WORKSHOP_MANAGER, ROLES.OWNER),
  createPaymentUrlController
);

// IPN Webhook tu vnpay sandbox (Server-to-Server)
router.get('/vnpay_ipn', vnpayIpnController);

// Trang return sau khi thanh toan tren web vnpay
router.get('/vnpay_return', vnpayReturnController);

module.exports = router;

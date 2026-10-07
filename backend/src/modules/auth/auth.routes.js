const express = require('express');
const router = express.Router();
const {
  requestOtpController,
  verifyOtpController,
  devLoginController,
  staffLoginController,
} = require('./controllers/auth.controller');
const { otpRateLimiter } = require('../../middlewares/otpRateLimiter');
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'auth' }, 'Phân hệ Xác thực (Auth) đang hoạt động');
});

// endpoint yeu cau gui otp qua gmail (uc-01)
router.post('/request-otp', otpRateLimiter, requestOtpController);

// endpoint xac thuc otp va cap token jwt (uc-01)
router.post('/verify-otp', verifyOtpController);

// endpoint dang nhap nhan vien qua sdt va mat khau thuc te
router.post('/staff-login', staffLoginController);

// endpoint dang nhap dev / staff login cap JWT Token thuc te
router.post('/dev-login', devLoginController);

module.exports = router;

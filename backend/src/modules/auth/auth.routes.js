const express = require('express');
const router = express.Router();
const { requestOtpController } = require('./controllers/auth.controller');
const { otpRateLimiter } = require('../../middlewares/otpRateLimiter');
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'auth' }, 'Phân hệ Xác thực (Auth) đang hoạt động');
});

// endpoint yeu cau gui otp qua gmail (uc-01)
router.post('/request-otp', otpRateLimiter, requestOtpController);

module.exports = router;

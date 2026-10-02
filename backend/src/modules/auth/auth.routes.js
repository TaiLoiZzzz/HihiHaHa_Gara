const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'auth' }, 'Phân hệ Xác thực (Auth) đang hoạt động');
});

module.exports = router;

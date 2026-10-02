const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'vehicle' }, 'Phân hệ Xe & Sổ bảo dưỡng (Vehicle) đang hoạt động');
});

module.exports = router;

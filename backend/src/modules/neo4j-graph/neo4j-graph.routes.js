const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../../utils/response');

router.get('/health', (req, res) => {
  return sendSuccess(res, { module: 'neo4j-graph' }, 'Phân hệ Đồ thị Tương thích Neo4j (Parts Graph) đang hoạt động');
});

module.exports = router;

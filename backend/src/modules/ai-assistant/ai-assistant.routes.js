const express = require('express');
const router = express.Router();
const { diagnoseVehicleController } = require('./controllers/ai-assistant.controller');

// Endpoint Chẩn đoán Hư hỏng Ô tô bằng Graph-RAG AI
router.post('/diagnose', diagnoseVehicleController);

module.exports = router;

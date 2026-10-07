const express = require('express');
const router = express.Router();

const authRoutes = require('./modules/auth/auth.routes');
const vehicleRoutes = require('./modules/vehicle/vehicle.routes');
const workOrderRoutes = require('./modules/work-order/work-order.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const neo4jGraphRoutes = require('./modules/neo4j-graph/neo4j-graph.routes');
const aiAssistantRoutes = require('./modules/ai-assistant/ai-assistant.routes');

// dang ky tat ca cac endpoint RESTful API v1
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/payments', paymentRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/parts-graph', neo4jGraphRoutes);
router.use('/ai', aiAssistantRoutes);

module.exports = router;

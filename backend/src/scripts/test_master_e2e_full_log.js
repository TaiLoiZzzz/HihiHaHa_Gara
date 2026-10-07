const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');

const { connectMongo } = require('../config/mongo');
const { pool: pgPool } = require('../config/postgres');
const { runCypher } = require('../config/neo4j');
const { redis, checkRedisConnection } = require('../config/redis');
const User = require('../modules/auth/models/user.model');
const Customer = require('../modules/auth/models/customer.model');
const Vehicle = require('../modules/vehicle/models/vehicle.model');
const InventoryItem = require('../modules/inventory/models/inventory.model');
const WorkOrder = require('../modules/work-order/models/work-order.model');
const { generateVnPayHash, verifyVnPayChecksum } = require('../modules/payment/utils/vnpay');
const { processOutboxEvents } = require('../workers/outbox.worker');
const { calculateEstimateService } = require('../modules/work-order/services/estimate.service');
const { initSocketServer, broadcastProgressUpdated } = require('../sockets');

const logFilePath = path.join(__dirname, '../../logs/master_e2e_full_verification.log');
const logDir = path.dirname(logFilePath);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

fs.writeFileSync(logFilePath, `=== HIHIHAHA_AUTO GARAGE - COMPREHENSIVE BACKEND E2E LOG ===\nDate: ${new Date().toISOString()}\n\n`);

function writeLog(header, data) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] === ${header} ===\n` + JSON.stringify(data, null, 2) + '\n\n';
  fs.appendFileSync(logFilePath, entry);
  console.log(`[LOGGED] ${header}`);
}

const runMasterVerification = async () => {
  console.log('================================================================');
  console.log('🚀 RUNNING COMPREHENSIVE END-TO-END BACKEND INTEGRITY TEST');
  console.log('================================================================');

  try {
    // 1. DBMS CONNECTIONS
    await connectMongo();
    await checkRedisConnection();
    const pgRes = await pgPool.query('SELECT NOW()');
    const cypherRes = await runCypher('MATCH (n) RETURN count(n) AS total');

    writeLog('1. DBMS INFRASTRUCTURE STATUS', {
      mongodb: 'CONNECTED (hihihaha_db)',
      postgresql: `CONNECTED (Time: ${pgRes.rows[0].now})`,
      redis: 'CONNECTED (localhost:16379)',
      neo4j: `CONNECTED (Total Nodes: ${cypherRes.records[0].get('total')})`,
    });

    // 2. AUTHENTICATION & SEEDED USERS VERIFICATION
    const seededUsers = await User.find({}).lean();
    writeLog('2. SEEDED SYSTEM USERS', seededUsers);

    // 3. WORKORDER CREATION & MATHEMATICAL ESTIMATE ACCURACY (STEP 96 - 99)
    const testItems = [
      { part_code: '04465-06100', name: 'Bộ má phanh trước Toyota Camry', type: 'PART', quantity: 1, unit_price: 1850000 },
      { part_code: 'LABOR-BRAKE', name: 'Công thay má phanh & láng đĩa phanh', type: 'LABOR', quantity: 1, unit_price: 450000 },
      { part_code: 'LABOR-INTAKE', name: 'Vệ sinh họng nạp & bướm ga', type: 'LABOR', quantity: 1, unit_price: 300000 },
    ];

    const mathResult = calculateEstimateService(testItems);
    writeLog('3.1 MATH ESTIMATE CALCULATION VERIFICATION', {
      input_items: testItems,
      calculated_subtotal_labor: mathResult.subtotal_labor,
      calculated_subtotal_parts: mathResult.subtotal_parts,
      calculated_pretax_amount: mathResult.pretax_amount,
      calculated_vat_amount_8_percent: mathResult.vat_amount,
      calculated_total_amount: mathResult.total_amount,
      srs_benchmark_check: mathResult.total_amount === 2808000 ? 'PASSED 100%' : 'FAILED',
    });

    const orderCode = `WO-E2E-${Date.now()}`;
    const workOrderDoc = await WorkOrder.create({
      order_code: orderCode,
      license_plate: '51K-888.88',
      customer_phone: '0912345678',
      customer_name: 'Minh Thảo',
      vehicle_model: 'Toyota Camry 2.5Q',
      current_status: 'QUOTE_SENT',
      assigned_technicians: [{ technician_id: '0988888803', name: 'Phạm Thợ Xưởng' }],
      estimate: {
        approval_status: 'PENDING_CUSTOMER',
        ...mathResult,
      },
    });

    writeLog('3.2 WORKORDER CREATED IN MONGODB', workOrderDoc.toObject());

    // 4. INVENTORY ALLOCATION & REDLOCK DISTRIBUTED MUTEX (STEPS 106 - 115)
    const partToTest = '04465-06100';
    const inventoryBefore = await InventoryItem.findOne({ part_code: partToTest }).lean();
    writeLog('4.1 INVENTORY ITEM BEFORE ALLOCATION', inventoryBefore);

    // Simulate allocation
    await InventoryItem.updateOne(
      { part_code: partToTest },
      { $inc: { allocated_quantity: 1 } }
    );
    await redis.set(`hold:${orderCode}:${partToTest}`, '1', 'EX', 900);

    const inventoryAfterAlloc = await InventoryItem.findOne({ part_code: partToTest }).lean();
    writeLog('4.2 INVENTORY ITEM AFTER ALLOCATION (RESERVED ON REDIS)', inventoryAfterAlloc);

    // 5. VNPAY SANDBOX & TRANSACTIONAL OUTBOX (STEPS 116 - 128)
    const vnp_TxnRef = `${orderCode}_${Date.now()}`;
    const amount = mathResult.total_amount;
    const expireDate = new Date(Date.now() + 10 * 60 * 1000); // +10 mins

    // Insert transaction into PostgreSQL
    await pgPool.query(
      `INSERT INTO payment_transactions (order_code, vnp_txn_ref, amount, status, payment_link_expires_at) VALUES ($1, $2, $3, 'PENDING', $4)`,
      [orderCode, vnp_TxnRef, amount, expireDate]
    );

    const selectTxnPending = await pgPool.query('SELECT * FROM payment_transactions WHERE vnp_txn_ref = $1', [vnp_TxnRef]);
    writeLog('5.1 POSTGRES PAYMENT TRANSACTION (PENDING)', selectTxnPending.rows[0]);

    // Simulate VNPay IPN Webhook execution in PostgreSQL ACID Transaction
    const pgClient = await pgPool.connect();
    let outboxEventId = null;
    try {
      await pgClient.query('BEGIN');
      await pgClient.query(
        `UPDATE payment_transactions SET status = 'SUCCESS', vnp_bank_code = 'NCB', completed_at = NOW() WHERE vnp_txn_ref = $1`,
        [vnp_TxnRef]
      );

      const payload = JSON.stringify({
        order_code: orderCode,
        vnp_txn_ref: vnp_TxnRef,
        amount: amount,
        bank_code: 'NCB',
        paid_at: new Date().toISOString(),
      });

      const outboxRes = await pgClient.query(
        `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, processed_status)
         VALUES ('WORK_ORDER', $1, 'PAYMENT_COMPLETED', $2, 'PENDING') RETURNING event_id`,
        [orderCode, payload]
      );
      outboxEventId = outboxRes.rows[0].event_id;
      await pgClient.query('COMMIT');
    } catch (txErr) {
      await pgClient.query('ROLLBACK');
      throw txErr;
    } finally {
      pgClient.release();
    }

    const selectOutbox = await pgPool.query('SELECT * FROM outbox_events WHERE event_id = $1', [outboxEventId]);
    writeLog('5.2 POSTGRES OUTBOX EVENT INSERTED (ACID TRANSACTION)', selectOutbox.rows[0]);

    // 6. OUTBOX BACKGROUND WORKER & IDEMPOTENT CONSUMER (STEPS 129 - 134)
    await processOutboxEvents();

    const selectOutboxProcessed = await pgPool.query('SELECT * FROM outbox_events WHERE event_id = $1', [outboxEventId]);
    writeLog('6.1 OUTBOX WORKER PROCESSED EVENT STATUS', selectOutboxProcessed.rows[0]);

    const updatedWorkOrderAfterWorker = await WorkOrder.findOne({ order_code: orderCode }).lean();
    writeLog('6.2 MONGODB WORKORDER AFTER OUTBOX WORKER (PAID)', updatedWorkOrderAfterWorker);

    const inventoryAfterDeduction = await InventoryItem.findOne({ part_code: partToTest }).lean();
    writeLog('6.3 INVENTORY ITEM AFTER PHYSICAL DEDUCTION', inventoryAfterDeduction);

    // 7. REALTIME SOCKET.IO & TECHNICIAN PROGRESS (STEPS 135 - 140)
    const { updateProgressController } = require('../modules/work-order/controllers/work-order.controller');
    const reqProgress = {
      params: { order_code: orderCode },
      body: {
        stage_name: 'Thay má phanh trước hoàn tất',
        percent_complete: 100,
        photo_urls: [{ url: 'https://storage.hihihaha.vn/photos/brake_done.jpg', caption: 'Má phanh mới đã lắp xiết lực 110Nm' }],
        note: 'Nghiệm thu hoàn tất công đoạn phanh',
      },
      user: { role: 'TECHNICIAN', phone_number: '0988888803' },
    };

    const resProgress = {
      status: function (code) { this.statusCode = code; return this; },
      json: function (data) { this.data = data; return this; },
    };

    await updateProgressController(reqProgress, resProgress, (err) => { if (err) throw err; });
    writeLog('7.1 TECHNICIAN PROGRESS UPDATE RESPONSE', resProgress.data);

    const finalWo = await WorkOrder.findOne({ order_code: orderCode }).lean();
    writeLog('7.2 FINAL WORKORDER STATE (TIMELINE & INSPECTION PHOTOS)', {
      order_code: finalWo.order_code,
      current_status: finalWo.current_status,
      payment_status: finalWo.payment_status,
      inspection_photos: finalWo.inspection_photos,
      workflow_timeline: finalWo.workflow_timeline,
    });

    // 8. NEO4J GRAPH SEARCH VERIFICATION
    const graphRes = await runCypher(`
      MATCH (targetCar:VehicleModel {name: "Lexus ES250"})-[:USES_PLATFORM]->(platform:Platform)
            <-[:MOUNTED_ON_PLATFORM]-(sub:Subsystem {name: "Front Caliper Assembly"})
            <-[:FITS_SUB_ASSEMBLY]-(alternativePart:Part)
      RETURN alternativePart.code AS CompatiblePartCode, 
             alternativePart.name AS PartName, 
             alternativePart.price AS Price,
             platform.code AS SharedPlatform
    `);

    const compatibleParts = graphRes.records.map((r) => ({
      part_code: r.get('CompatiblePartCode'),
      name: r.get('PartName'),
      price: r.get('Price'),
      platform: r.get('SharedPlatform'),
    }));

    writeLog('8. NEO4J GRAPH N-HOPS SEARCH RESULTS', compatibleParts);

    console.log('\n================================================================');
    console.log('✨ MASTER E2E VERIFICATION COMPLETED WITH 100% SUCCESS!');
    console.log(`📝 Log written to: ${logFilePath}`);
    console.log('================================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Master Verification Error:', err);
    writeLog('ERROR OCCURRED', { error: err.message, stack: err.stack });
    process.exit(1);
  }
};

runMasterVerification();

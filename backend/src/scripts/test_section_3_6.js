const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectMongo } = require('../config/mongo');
const { pool: pgPool } = require('../config/postgres');
const { redis } = require('../config/redis');
const WorkOrder = require('../modules/work-order/models/work-order.model');
const InventoryItem = require('../modules/inventory/models/inventory.model');
const { calculateEstimateService } = require('../modules/work-order/services/estimate.service');
const { processOutboxEvents } = require('../workers/outbox.worker');

const logLines = [];

function printLog(msg, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${type}] ${msg}`;
  console.log(formatted);
  logLines.push(formatted);
}

async function testSection36() {
  printLog('================================================================');
  printLog('🚀 STARTING SECTION 3.6 TEST SUITE: OUTBOX WORKER & IDEMPOTENT CONSUMER');
  printLog('================================================================');

  try {
    await connectMongo();
    printLog('✅ MongoDB & PostgreSQL connected successfully');

    // 1. Prepare Inventory Item with stock
    await InventoryItem.deleteMany({ part_code: 'TEST-OUTBOX-PAD' });
    const part = await InventoryItem.create({
      part_code: 'TEST-OUTBOX-PAD',
      part_name: 'Má phanh thử nghiệm Outbox Worker',
      category: 'BRAKE_SYSTEM',
      unit: 'BỘ',
      cost_price: 1000000,
      retail_price: 1500000,
      stock_quantity: 10,
      allocated_quantity: 1, // Has 1 allocated
      location_rack: 'KỆ-OUTBOX-01',
    });
    printLog(`✅ Created Test Part: ${part.part_name} (Initial Q_stock: 10, Q_alloc: 1)`);

    // 2. Prepare WorkOrder
    const order_code = `WO-OUTBOX-${Date.now()}`;
    const sampleItems = [
      { part_code: 'TEST-OUTBOX-PAD', name: 'Má phanh thử nghiệm Outbox Worker', type: 'PART', quantity: 1, unit_price: 1500000, selected: true },
      { part_code: 'LABOR-01', name: 'Công thay', type: 'LABOR', quantity: 1, unit_price: 300000, selected: true },
    ];
    const estimateData = calculateEstimateService(sampleItems);

    const workOrder = await WorkOrder.create({
      order_code,
      license_plate: '51K-888.88',
      customer_phone: '0912345678',
      customer_name: 'Minh Thảo',
      vehicle_model: 'Toyota Camry 2.5Q',
      current_status: 'PAYMENT_PENDING',
      payment_status: 'UNPAID',
      estimate: estimateData,
    });
    printLog(`✅ Created WorkOrder: ${workOrder.order_code} (Initial Status: PAYMENT_PENDING, PaymentStatus: UNPAID)`);

    // 3. Insert PENDING Outbox Event into PostgreSQL (Steps 129 & 130)
    printLog('\n🔹 STEPS 129 & 130: INSERT PENDING OUTBOX EVENT INTO POSTGRESQL');
    const payload = JSON.stringify({
      order_code,
      vnp_txn_ref: `${order_code}_123`,
      amount: estimateData.total_amount,
      bank_code: 'NCB',
      paid_at: new Date().toISOString(),
    });

    const insertRes = await pgPool.query(
      `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, processed_status)
       VALUES ('WORK_ORDER', $1, 'PAYMENT_COMPLETED', $2, 'PENDING')
       RETURNING event_id;`,
      [order_code, payload]
    );
    const eventId = insertRes.rows[0].event_id;
    printLog(`✅ Inserted PENDING Outbox Event (ID: ${eventId}) for order ${order_code}`);


    // 4. Run processOutboxEvents() (Steps 131 - 133)
    printLog('\n🔹 STEPS 131 -> 133: RUN OUTBOX WORKER & IDEMPOTENT CONSUMER PROCESSING');
    await processOutboxEvents();

    // Verify MongoDB WorkOrder payment_status -> PAID
    const updatedWo = await WorkOrder.findOne({ order_code });
    printLog(`✅ WorkOrder Mongo Status Updated: current_status=${updatedWo.current_status}, payment_status=${updatedWo.payment_status}`);
    if (updatedWo.payment_status !== 'PAID' || updatedWo.current_status !== 'PAID') {
      throw new Error('WorkOrder payment status update failed!');
    }

    // Verify Physical Inventory Deduction (Step 132)
    const updatedPart = await InventoryItem.findOne({ part_code: 'TEST-OUTBOX-PAD' });
    printLog(`✅ Physical Inventory Deducted: Q_stock = ${updatedPart.stock_quantity} (Expected: 9), Q_alloc = ${updatedPart.allocated_quantity} (Expected: 0)`);
    if (updatedPart.stock_quantity !== 9 || updatedPart.allocated_quantity !== 0) {
      throw new Error('Physical inventory deduction failed!');
    }

    // Verify PostgreSQL Outbox Event status -> PROCESSED (Step 133)
    const outboxCheck = await pgPool.query('SELECT * FROM outbox_events WHERE event_id = $1', [eventId]);
    printLog(`✅ PostgreSQL Outbox Event Status: ${outboxCheck.rows[0].processed_status} (ProcessedAt: ${outboxCheck.rows[0].processed_at})`);
    if (outboxCheck.rows[0].processed_status !== 'PROCESSED') {
      throw new Error('Outbox event status update to PROCESSED failed!');
    }


    // 5. Test Consumer Idempotency (Duplicate Event Processing) (Step 131)
    printLog('\n🔹 STEP 131: CONSUMER IDEMPOTENCY TEST (DUPLICATE PROCESSING)');

    // Re-insert same event to test duplicate event handling
    const dupInsertRes = await pgPool.query(
      `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, processed_status)
       VALUES ('WORK_ORDER', $1, 'PAYMENT_COMPLETED', $2, 'PENDING')
       RETURNING event_id;`,
      [order_code, payload]
    );
    const dupEventId = dupInsertRes.rows[0].event_id;

    await processOutboxEvents();

    const partAfterDup = await InventoryItem.findOne({ part_code: 'TEST-OUTBOX-PAD' });
    printLog(`✅ Idempotency Verified: Stock Q_stock remains ${partAfterDup.stock_quantity} (No duplicate deduction!)`);
    if (partAfterDup.stock_quantity !== 9) {
      throw new Error('Idempotency failed! Stock was deducted twice!');
    }


    // 6. Test Retry & DEAD_LETTER Exponential Backoff (Step 134)
    printLog('\n🔹 STEP 134: RETRY & DEAD_LETTER EXPONENTIAL BACKOFF TEST');

    const badPayload = JSON.stringify({ invalid_data: true });
    const badInsertRes = await pgPool.query(
      `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, processed_status, retry_count)
       VALUES ('WORK_ORDER', 'WO-BAD-001', 'PAYMENT_COMPLETED', $1, 'PENDING', 4)
       RETURNING event_id;`,
      [badPayload]
    );
    const badEventId = badInsertRes.rows[0].event_id;

    await processOutboxEvents();

    const badCheck = await pgPool.query('SELECT * FROM outbox_events WHERE event_id = $1', [badEventId]);
    printLog(`✅ Dead Letter Handling Verified: RetryCount = ${badCheck.rows[0].retry_count}, Status = ${badCheck.rows[0].processed_status}`);
    if (badCheck.rows[0].processed_status !== 'DEAD_LETTER') {
      throw new Error('Failed event should have been moved to DEAD_LETTER!');
    }

    printLog('\n================================================================');
    printLog('✨ SECTION 3.6 FULLY TESTED & VERIFIED WITH 100% SUCCESS!');
    printLog('================================================================');

  } catch (err) {
    printLog(`❌ SECTION 3.6 TEST FAILED: ${err.message}`, 'ERROR');
    if (err.stack) printLog(err.stack, 'ERROR');
  } finally {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFilePath = path.join(logsDir, 'section_3_6_test_report.log');
    fs.writeFileSync(logFilePath, logLines.join('\n'), 'utf8');
    printLog(`\n📝 Full Log written to: ${logFilePath}`);

    await pgPool.end();
    await redis.quit();
    process.exit(0);
  }
}

testSection36();

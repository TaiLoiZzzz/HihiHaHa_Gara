const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectMongo } = require('../config/mongo');
const { redis } = require('../config/redis');
const InventoryItem = require('../modules/inventory/models/inventory.model');
const { allocatePartsService, deallocatePartsService, createPaymentSessionLock } = require('../modules/inventory/services/inventory.service');
const { createPartController, createStockAdjustmentController } = require('../modules/inventory/controllers/inventory.controller');

const logLines = [];

function printLog(msg, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${type}] ${msg}`;
  console.log(formatted);
  logLines.push(formatted);
}

async function testSection34() {
  printLog('================================================================');
  printLog('🚀 STARTING SECTION 3.4 TEST SUITE: REDLOCK & INVENTORY MUTEX');
  printLog('================================================================');

  try {
    await connectMongo();
    printLog('✅ MongoDB & Redis connected successfully');

    // -----------------------------------------------------------------
    // 1. INVENTORY ITEM CREATION & STOCK ADJUSTMENT (STEP 107)
    // -----------------------------------------------------------------
    printLog('\n🔹 STEP 107: INVENTORY ITEM CRUD & STOCK ADJUSTMENT VOUCHER');
    
    await InventoryItem.deleteMany({ part_code: { $in: ['TEST-PAD-01', 'TEST-RACE-PAD'] } });

    // Mock Create Part
    const reqCreate = {
      body: {
        part_code: 'TEST-PAD-01',
        part_name: 'Bộ má phanh thử nghiệm Redlock',
        category: 'BRAKE_SYSTEM',
        unit: 'BỘ',
        cost_price: 1000000,
        retail_price: 1500000,
        stock_quantity: 5,
        location_rack: 'KỆ-TEST-01',
      },
    };
    const resCreate = {
      status: function () { return this; },
      json: function (d) { printLog(`✅ Created Part: ${d.data.part_name} (Code: ${d.data.part_code}, Stock: ${d.data.stock_quantity})`); },
    };
    await createPartController(reqCreate, resCreate, (e) => { if (e) throw e; });

    // Stock Adjustment Voucher ST-YYYYMMDD-XX
    const reqAdj = {
      body: {
        part_code: 'TEST-PAD-01',
        actual_quantity: 10,
        reason_category: 'KIỂM_KÊ_ĐẦU_THÁNG',
        note: 'CLI Test kiểm kê tăng từ 5 lên 10 bộ',
      },
      user: { phone_number: '0988888888' },
    };
    const resAdj = {
      status: function () { return this; },
      json: function (d) {
        printLog(`✅ [Voucher ${d.data.voucher_code}] Stock Adjusted: Prev ${d.data.previous_quantity} -> Actual ${d.data.actual_quantity} (Variance: +${d.data.variance})`);
      },
    };
    await createStockAdjustmentController(reqAdj, resAdj, (e) => { if (e) throw e; });


    // -----------------------------------------------------------------
    // 2. REDLOCK ALLOCATION & AVAILABLE STOCK CHECK (STEPS 108 -> 112)
    // -----------------------------------------------------------------
    printLog('\n🔹 STEPS 108 -> 112: REDLOCK MUTEX ALLOCATION & AVAILABILITY CHECK');

    const allocResult = await allocatePartsService('WO-TEST-001', [
      { part_code: 'TEST-PAD-01', type: 'PART', quantity: 2, selected: true },
    ]);

    printLog(`✅ Allocation Success: Allocated ${allocResult.allocatedParts[0].allocated_qty} items of TEST-PAD-01`);
    
    let itemAfterAlloc = await InventoryItem.findOne({ part_code: 'TEST-PAD-01' });
    printLog(`   - Physical Stock (Q_stock): ${itemAfterAlloc.stock_quantity}`);
    printLog(`   - Allocated Qty (Q_alloc): ${itemAfterAlloc.allocated_quantity}`);
    printLog(`   - Available Stock (Q_avail): ${itemAfterAlloc.stock_quantity - itemAfterAlloc.allocated_quantity}`);


    // -----------------------------------------------------------------
    // 3. INSUFFICIENT STOCK EXCEPTION HANDLING (STEP 110)
    // -----------------------------------------------------------------
    printLog('\n🔹 STEP 110: INSUFFICIENT STOCK EXCEPTION HANDLING');

    try {
      await allocatePartsService('WO-TEST-002', [
        { part_code: 'TEST-PAD-01', type: 'PART', quantity: 15, selected: true },
      ]);
      throw new Error('Should have failed due to insufficient stock!');
    } catch (err) {
      if (err.errorCode === 'INSUFFICIENT_STOCK_ERROR') {
        printLog(`✅ Exception successfully caught: ${err.message}`);
      } else {
        throw err;
      }
    }


    // -----------------------------------------------------------------
    // 4. ORDER CANCELLATION DEALLOCATION SERVICE (STEP 113)
    // -----------------------------------------------------------------
    printLog('\n🔹 STEP 113: DEALLOCATE PARTS ON ORDER CANCEL');

    await deallocatePartsService('WO-TEST-001', [
      { part_code: 'TEST-PAD-01', type: 'PART', quantity: 2, selected: true },
    ]);

    let itemAfterDealloc = await InventoryItem.findOne({ part_code: 'TEST-PAD-01' });
    printLog(`✅ Deallocation Complete: Q_alloc reduced to ${itemAfterDealloc.allocated_quantity}, Q_avail restored to ${itemAfterDealloc.stock_quantity - itemAfterDealloc.allocated_quantity}`);


    // -----------------------------------------------------------------
    // 5. IDEMPOTENT PAYMENT SESSION LOCK (STEP 114)
    // -----------------------------------------------------------------
    printLog('\n🔹 STEP 114: IDEMPOTENT PAYMENT SESSION LOCK (10 MINUTES TTL)');

    await redis.del('lock:payment:WO-TEST-9999');
    const lock1 = await createPaymentSessionLock('WO-TEST-9999');
    printLog(`✅ Payment Lock Created: ${lock1.lockKey} (TTL: ${lock1.ttl_seconds}s)`);

    try {
      await createPaymentSessionLock('WO-TEST-9999');
      throw new Error('Duplicate payment lock should have been rejected!');
    } catch (err) {
      if (err.errorCode === 'PAYMENT_SESSION_LOCKED') {
        printLog(`✅ Idempotent Lock Protection Verified: ${err.message}`);
      } else {
        throw err;
      }
    }


    // -----------------------------------------------------------------
    // 6. RACE CONDITION CONCURRENCY BURST SIMULATION (STEP 115)
    // -----------------------------------------------------------------
    printLog('\n🔹 STEP 115: RACE CONDITION CONCURRENCY BURST SIMULATION (20 BURST REQUESTS FOR 1 ITEM)');

    await InventoryItem.create({
      part_code: 'TEST-RACE-PAD',
      part_name: 'Má phanh hiếm còn duy nhất 1 bộ',
      category: 'BRAKE_SYSTEM',
      unit: 'BỘ',
      cost_price: 1200000,
      retail_price: 1800000,
      stock_quantity: 1, // CHỈ CÒN DUY NHẤT 1 BỘ!
      allocated_quantity: 0,
      location_rack: 'KỆ-VIP-01',
    });

    printLog('💥 Initiating 20 concurrent requests simultaneously using Promise.allSettled...');

    const concurrentRequests = Array.from({ length: 20 }, (_, i) => {
      return allocatePartsService(`WO-BURST-${i + 1}`, [
        { part_code: 'TEST-RACE-PAD', type: 'PART', quantity: 1, selected: true },
      ]);
    });

    const results = await Promise.allSettled(concurrentRequests);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    printLog(`📊 Burst Allocation Simulation Results:`);
    printLog(`   - Successful Allocations (200 OK)  : ${fulfilled.length}`);
    printLog(`   - Rejected Conflicts (409 CONFLICT): ${rejected.length}`);

    if (fulfilled.length === 1 && rejected.length === 19) {
      printLog('✅ RACE CONDITION TEST PASSED 100%! Redlock Mutex prevented overselling completely!');
    } else {
      throw new Error(`Race condition failed! Fulfilled: ${fulfilled.length}, Rejected: ${rejected.length}`);
    }

    const finalRaceItem = await InventoryItem.findOne({ part_code: 'TEST-RACE-PAD' });
    printLog(`   - Final Stock Q_stock: ${finalRaceItem.stock_quantity}, Allocated Q_alloc: ${finalRaceItem.allocated_quantity}`);

    printLog('\n================================================================');
    printLog('✨ SECTION 3.4 FULLY TESTED & VERIFIED WITH 100% SUCCESS!');
    printLog('================================================================');

  } catch (err) {
    printLog(`❌ SECTION 3.4 TEST FAILED: ${err.message}`, 'ERROR');
    if (err.stack) printLog(err.stack, 'ERROR');
  } finally {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFilePath = path.join(logsDir, 'section_3_4_test_report.log');
    fs.writeFileSync(logFilePath, logLines.join('\n'), 'utf8');
    printLog(`\n📝 Full Log written to: ${logFilePath}`);

    await redis.quit();
    process.exit(0);
  }
}

testSection34();

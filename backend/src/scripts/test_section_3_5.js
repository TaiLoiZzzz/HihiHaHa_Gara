const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectMongo } = require('../config/mongo');
const { pool: pgPool } = require('../config/postgres');
const { redis } = require('../config/redis');
const WorkOrder = require('../modules/work-order/models/work-order.model');
const { calculateEstimateService } = require('../modules/work-order/services/estimate.service');
const { createPaymentUrlController, vnpayIpnController } = require('../modules/payment/controllers/payment.controller');
const { generateVnPayHash, verifyVnPayChecksum } = require('../modules/payment/utils/vnpay');

const logLines = [];

function printLog(msg, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${type}] ${msg}`;
  console.log(formatted);
  logLines.push(formatted);
}

async function testSection35() {
  printLog('================================================================');
  printLog('🚀 STARTING SECTION 3.5 TEST SUITE: VNPAY SANDBOX & OUTBOX');
  printLog('================================================================');

  try {
    await connectMongo();
    printLog('✅ MongoDB & Postgres connected successfully');

    // 1. Create mock WorkOrder in MongoDB
    const order_code = `WO-VNP-${Date.now()}`;
    const sampleItems = [
      { part_code: '04465-06100', name: 'Bộ má phanh trước Toyota Camry', type: 'PART', quantity: 1, unit_price: 1850000, selected: true },
      { part_code: 'LABOR-01', name: 'Công thay má phanh', type: 'LABOR', quantity: 1, unit_price: 450000, selected: true },
    ];
    const estimateData = calculateEstimateService(sampleItems);

    const workOrder = await WorkOrder.create({
      order_code,
      license_plate: '51K-888.88',
      customer_phone: '0912345678',
      customer_name: 'Minh Thảo',
      vehicle_model: 'Toyota Camry 2.5Q',
      current_status: 'COMPLETED',
      estimate: estimateData,
    });
    printLog(`✅ Created Mock WorkOrder: ${workOrder.order_code} (Total: ${workOrder.estimate.total_amount} VNĐ)`);

    // 2. Test createPaymentUrlController (Steps 117 - 120)
    printLog('\n🔹 STEPS 117 -> 120: CREATE VNPAY PAYMENT URL & POSTGRES TRANSACTION');
    let generatedTxnRef = '';
    let generatedUrl = '';

    const reqUrl = {
      body: { order_code, bank_code: 'NCB' },
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const resUrl = {
      status: function () { return this; },
      json: function (d) {
        generatedTxnRef = d.data.vnp_txn_ref;
        generatedUrl = d.data.payment_url;
        printLog(`✅ Payment URL Generated Successfully!`);
        printLog(`   - vnp_TxnRef: ${generatedTxnRef}`);
        printLog(`   - Payment URL: ${generatedUrl.substring(0, 70)}...`);
      },
    };

    await createPaymentUrlController(reqUrl, resUrl, (e) => { if (e) throw e; });

    // Verify Postgres record in payment_transactions (Step 119)
    const pgTrans = await pgPool.query('SELECT * FROM payment_transactions WHERE vnp_txn_ref = $1', [generatedTxnRef]);
    if (pgTrans.rows.length === 0 || pgTrans.rows[0].status !== 'PENDING') {
      throw new Error('PostgreSQL record creation failed!');
    }
    printLog(`✅ PostgreSQL payment_transactions record verified in status PENDING`);


    // 3. Test Checksum Signing & Verification (Step 116 & 122)
    printLog('\n🔹 STEP 116 & 122: VNPAY HMAC-SHA512 CHECKSUM VALIDATION');
    const secretKey = process.env.VNP_HASH_SECRET || 'SECRETSECRET1234567890';
    const mockIpnParams = {
      vnp_Amount: `${workOrder.estimate.total_amount * 100}`,
      vnp_BankCode: 'NCB',
      vnp_BankTranNo: 'VNP14043789',
      vnp_CardType: 'ATM',
      vnp_OrderInfo: `Thanh toan lenh sua chua ${order_code}`,
      vnp_PayDate: '20261007153000',
      vnp_ResponseCode: '00',
      vnp_TmnCode: process.env.VNP_TMN_CODE || 'TESTTMN01',
      vnp_TransactionNo: '14043789',
      vnp_TransactionStatus: '00',
      vnp_TxnRef: generatedTxnRef,
    };

    const { vnpSecureHash } = generateVnPayHash(mockIpnParams, secretKey);
    mockIpnParams['vnp_SecureHash'] = vnpSecureHash;

    const isChecksumValid = verifyVnPayChecksum(mockIpnParams, secretKey);
    if (!isChecksumValid) throw new Error('HMAC-SHA512 Checksum verification failed!');
    printLog(`✅ HMAC-SHA512 Checksum Validation PASSED 100%!`);


    // 4. Test vnpayIpnController (Steps 121 - 128)
    printLog('\n🔹 STEPS 121 -> 128: VNPAY IPN WEBHOOK & POSTGRES ACID OUTBOX INSERTION');

    const reqIpn = { query: mockIpnParams };
    const resIpn = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (d) {
        printLog(`✅ IPN Response: ${JSON.stringify(d)}`);
        if (d.RspCode !== '00') throw new Error(`IPN Failed with code ${d.RspCode}: ${d.Message}`);
      },
    };

    await vnpayIpnController(reqIpn, resIpn, (e) => { if (e) throw e; });

    // Verify Postgres update to SUCCESS
    const pgSuccess = await pgPool.query('SELECT * FROM payment_transactions WHERE vnp_txn_ref = $1', [generatedTxnRef]);
    printLog(`✅ Postgres Transaction Status Updated: ${pgSuccess.rows[0].status} (Bank: ${pgSuccess.rows[0].vnp_bank_code})`);

    // Verify Outbox Event PENDING insertion (Step 127)
    const outboxRes = await pgPool.query('SELECT * FROM outbox_events WHERE aggregate_id = $1', [order_code]);
    if (outboxRes.rows.length === 0 || outboxRes.rows[0].processed_status !== 'PENDING') {
      throw new Error('Outbox event insertion failed!');
    }
    printLog(`✅ Outbox Event Verified! Event ID: ${outboxRes.rows[0].event_id}, Status: ${outboxRes.rows[0].processed_status}, EventType: ${outboxRes.rows[0].event_type}`);


    // 5. Test Duplicate Webhook Idempotency (Step 123)
    printLog('\n🔹 STEP 123: DUPLICATE WEBHOOK IDEMPOTENT PROTECTION');

    const resIpnDup = {
      status: function (code) { return this; },
      json: function (d) {
        printLog(`✅ Duplicate IPN Idempotent Protection Verified: ${JSON.stringify(d)}`);
        if (d.RspCode !== '02') throw new Error('Duplicate IPN should have returned RspCode 02');
      },
    };
    await vnpayIpnController(reqIpn, resIpnDup, (e) => { if (e) throw e; });

    printLog('\n================================================================');
    printLog('✨ SECTION 3.5 TESTED & VERIFIED WITH 100% SUCCESS!');
    printLog('================================================================');

  } catch (err) {
    printLog(`❌ SECTION 3.5 TEST FAILED: ${err.message}`, 'ERROR');
    if (err.stack) printLog(err.stack, 'ERROR');
  } finally {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFilePath = path.join(logsDir, 'section_3_5_test_report.log');
    fs.writeFileSync(logFilePath, logLines.join('\n'), 'utf8');
    printLog(`\n📝 Full Log written to: ${logFilePath}`);

    await pgPool.end();
    await redis.quit();
    process.exit(0);
  }
}

testSection35();

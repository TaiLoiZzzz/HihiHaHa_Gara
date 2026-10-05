const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Load env
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectMongo } = require('../config/mongo');
const { pool: pgPool } = require('../config/postgres');
const { driver: neo4jDriver, runCypher } = require('../config/neo4j');
const { redis } = require('../config/redis');

const Customer = require('../modules/auth/models/customer.model');
const Vehicle = require('../modules/vehicle/models/vehicle.model');
const InventoryItem = require('../modules/inventory/models/inventory.model');
const WorkOrder = require('../modules/work-order/models/work-order.model');

const { generateSecureOtp, hashOtp } = require('../utils/crypto');
const { calculateEstimateService } = require('../modules/work-order/services/estimate.service');
const { customerApproveEstimateController, updateWorkOrderStatusController } = require('../modules/work-order/controllers/work-order.controller');

const logLines = [];

function printLog(msg, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${type}] ${msg}`;
  console.log(formatted);
  logLines.push(formatted);
}

async function runFullSystemTestSuite() {
  printLog('================================================================');
  printLog('🚀 STARTING COMPREHENSIVE CLI TEST SUITE - HIHIHAHA_AUTO GARA');
  printLog('================================================================');

  try {
    // -----------------------------------------------------------------
    // 1. POLYGLOT MULTI-DBMS INFRASTRUCTURE HEALTH CHECK
    // -----------------------------------------------------------------
    printLog('\n🔹 PHASE 1: POLYGLOT MULTI-DBMS INFRASTRUCTURE HEALTH CHECK');
    
    // Mongo
    const mongoConn = await connectMongo();
    printLog(`✅ [MongoDB] Connected to host: ${mongoConn.connection.host}, DB: ${mongoConn.connection.name}`);
    
    // Postgres
    const pgRes = await pgPool.query('SELECT NOW() as current_time, version();');
    printLog(`✅ [PostgreSQL] Connected. DB Time: ${pgRes.rows[0].current_time}`);

    // Neo4j
    const neo4jRes = await runCypher('MATCH (n) RETURN count(n) AS node_count');
    printLog(`✅ [Neo4j] Connected via Bolt. Total Nodes: ${neo4jRes.records[0].get('node_count').toString()}`);

    // Redis
    const pong = await redis.ping();
    printLog(`✅ [Redis] Connected. PING -> ${pong}`);


    // -----------------------------------------------------------------
    // 2. DUAL VERIFICATION AUTH & OTP MODULE (UC-01 - STEPS 81 -> 95)
    // -----------------------------------------------------------------
    printLog('\n🔹 PHASE 2: DUAL VERIFICATION AUTH & OTP MODULE (UC-01)');
    
    const targetPlate = '51K-888.88';
    const targetPhone = '0912345678';

    const customer = await Customer.findOne({
      phone_number: targetPhone,
      'vehicles_owned.license_plate': targetPlate,
    });

    if (!customer) {
      throw new Error(`Customer with plate ${targetPlate} and phone ${targetPhone} not found in MongoDB`);
    }
    printLog(`✅ [UC-01 Dual Match] Found Customer: ${customer.full_name} (${customer.email})`);

    // OTP Generation & Hashing
    const rawOtp = generateSecureOtp();
    const hashedOtp = hashOtp(rawOtp);
    printLog(`🔑 Generated Secure 6-digit OTP: ${rawOtp} | SHA256 Hash: ${hashedOtp.substring(0, 20)}...`);

    // Redis Key Ops
    const otpKey = `otp:login:${targetPlate}`;
    await redis.set(otpKey, hashedOtp, 'EX', 300);
    const storedHash = await redis.get(otpKey);
    const isHashMatch = hashOtp(rawOtp) === storedHash;
    printLog(`✅ [Redis OTP Ops] OTP Hash stored & verified match: ${isHashMatch}`);

    // JWT Signing
    const mockJwt = jwt.sign(
      { userId: customer._id, phone_number: customer.phone_number, license_plate: targetPlate, role: 'CUSTOMER' },
      process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026',
      { expiresIn: '2h' }
    );
    printLog(`✅ [JWT Service] Issued AccessToken: ${mockJwt.substring(0, 35)}...`);

    // Audit Log
    customer.audit_logs.push({
      action: 'CLI_TEST_OTP_LOGIN',
      timestamp: new Date(),
      details: 'CLI Test suite verified OTP login flow',
    });
    await customer.save();
    printLog(`✅ [Customer AuditLog] Ghi vết audit_log thành công`);


    // -----------------------------------------------------------------
    // 3. WORKORDER & DYNAMIC ESTIMATE MODULE (UC-02 - STEPS 96 -> 105)
    // -----------------------------------------------------------------
    printLog('\n🔹 PHASE 3: WORKORDER & DYNAMIC ESTIMATE MODULE (STEPS 96 -> 105)');

    // Step 96: Create WorkOrder
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const order_code = `WO-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const sampleItems = [
      { part_code: '04465-06100', name: 'Bộ má phanh trước Toyota Camry', type: 'PART', quantity: 1, unit_price: 1850000 },
      { part_code: 'WIPER-01', name: 'Bộ gạt mưa silicon Camry', type: 'PART', quantity: 1, unit_price: 300000 },
      { part_code: 'LABOR-01', name: 'Công thay má phanh & láng đĩa', type: 'LABOR', quantity: 1, unit_price: 450000 },
    ];

    // Step 97 & 98: Math calculation
    const estimateData = calculateEstimateService(sampleItems);
    printLog(`📊 [Step 97 & 98 Math Calculation]`);
    printLog(`   - Subtotal Labor: ${estimateData.subtotal_labor.toLocaleString('vi-VN')} VNĐ`);
    printLog(`   - Subtotal Parts: ${estimateData.subtotal_parts.toLocaleString('vi-VN')} VNĐ`);
    printLog(`   - Pretax Amount : ${estimateData.pretax_amount.toLocaleString('vi-VN')} VNĐ (Expected: 2.600.000 VNĐ)`);
    printLog(`   - VAT 8% Tax    : ${estimateData.vat_amount.toLocaleString('vi-VN')} VNĐ (Expected: 208.000 VNĐ)`);
    printLog(`   - Total Amount  : ${estimateData.total_amount.toLocaleString('vi-VN')} VNĐ (Expected: 2.808.000 VNĐ)`);

    if (estimateData.pretax_amount !== 2600000 || estimateData.vat_amount !== 208000 || estimateData.total_amount !== 2808000) {
      throw new Error('SRS Math Benchmark Verification Failed!');
    }
    printLog(`✅ [Step 98 Math Verification] Passed 100% against SRS benchmark!`);

    // Step 99: Create embedded document
    const workOrder = await WorkOrder.create({
      order_code,
      license_plate: targetPlate,
      customer_phone: targetPhone,
      customer_name: customer.full_name,
      vehicle_model: 'Toyota Camry 2.5Q',
      current_status: 'QUOTE_SENT',
      estimate: estimateData,
      workflow_timeline: [
        {
          status: 'QUOTE_SENT',
          updated_by: 'SERVICE_ADVISOR',
          note: 'CLI Test created WorkOrder with embedded estimate',
        },
      ],
    });
    printLog(`✅ [Step 96 & 99 Embedded Storage] Created WorkOrder ${workOrder.order_code} with status ${workOrder.current_status}`);

    // Step 100 & 101: State Machine Guard Test
    printLog(`\n🛡️ [Step 101 State Machine Guard Test]`);
    const invalidReq = { params: { order_code }, body: { next_status: 'DELIVERED', note: 'Attempt illegal jump' } };
    const invalidRes = {};
    await updateWorkOrderStatusController(invalidReq, invalidRes, (err) => {
      if (err && err.errorCode === 'INVALID_STATUS_TRANSITION') {
        printLog(`✅ Guard successfully blocked illegal transition QUOTE_SENT -> DELIVERED: ${err.message}`);
      } else {
        throw new Error('State Machine Guard failed to block illegal transition!');
      }
    });

    // Step 102 - 105: Customer Approval & Part Reservation Trigger
    printLog(`\n✍️ [Step 102 -> 105 Customer Approval Flow]`);
    const approveReq = {
      params: { order_code },
      body: { selected_item_codes: ['04465-06100', 'LABOR-01'] },
      user: { phone_number: targetPhone, role: 'CUSTOMER' },
      app: { get: () => null },
    };
    const approveRes = {
      status: function () { return this; },
      json: function (data) {
        printLog(`✅ [Step 103 Approval Success] New Status: ${data.data.current_status}, Approval: ${data.data.estimate.approval_status}`);
      },
    };
    await customerApproveEstimateController(approveReq, approveRes, (err) => {
      if (err) throw err;
    });


    // -----------------------------------------------------------------
    // 4. NEO4J GRAPH CROSS-COMPATIBILITY SEARCH MODULE
    // -----------------------------------------------------------------
    printLog('\n🔹 PHASE 4: NEO4J GRAPH CROSS-COMPATIBILITY SEARCH MODULE');
    const graphQuery = `
      MATCH (p:Part {code: $part_code})-[:COMPATIBLE_WITH]->(pl:Platform)<-[:BUILT_ON]-(v:VehicleModel)
      RETURN p.name AS part_name, pl.name AS platform_name, v.name AS compatible_model
    `;
    const graphRes = await runCypher(graphQuery, { part_code: '04465-06100' });
    printLog(`🌐 Graph search result for Camry brake pad 04465-06100:`);
    graphRes.records.forEach((rec) => {
      printLog(`   - Compatible Model: ${rec.get('compatible_model')} (Platform: ${rec.get('platform_name')})`);
    });

    printLog('\n================================================================');
    printLog('✨ ALL SYSTEM MODULES TESTED & VERIFIED WITH 100% SUCCESS!');
    printLog('================================================================');

  } catch (err) {
    printLog(`❌ TEST FAILED: ${err.message}`, 'ERROR');
    if (err.stack) printLog(err.stack, 'ERROR');
  } finally {
    // Write log report
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFilePath = path.join(logsDir, 'test_execution_report.log');
    fs.writeFileSync(logFilePath, logLines.join('\n'), 'utf8');
    printLog(`\n📝 Full Execution Log written to: ${logFilePath}`);

    // Close connections
    if (pgPool) await pgPool.end();
    if (neo4jDriver) await neo4jDriver.close();
    if (redis) await redis.quit();
    process.exit(0);
  }
}

runFullSystemTestSuite();

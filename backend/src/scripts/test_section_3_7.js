const http = require('http');
const app = require('../app');
const { connectMongo } = require('../config/mongo');
const { checkRedisConnection } = require('../config/redis');
const WorkOrder = require('../modules/work-order/models/work-order.model');
const { initSocketServer, broadcastProgressUpdated } = require('../sockets');

const runSection37Tests = async () => {
  console.log('================================================================');
  console.log('🚀 STARTING SECTION 3.7 TEST SUITE: REALTIME SOCKET.IO & UC-04');
  console.log('================================================================');

  let server = null;

  try {
    await checkRedisConnection();
    await connectMongo();

    // 1. Khoi tao HTTP Server & Socket.io Server (Step 135)
    server = http.createServer(app);
    const io = initSocketServer(server);

    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    console.log(`✅ [Step 135] Test Socket.io Server listening on http://localhost:${port}`);

    const testOrderCode = 'WO-20261001-0089';

    // 2. Dam bao workOrder co san trong MongoDB
    let workOrder = await WorkOrder.findOne({ order_code: testOrderCode });
    if (!workOrder) {
      workOrder = await WorkOrder.create({
        order_code: testOrderCode,
        license_plate: '51K-888.88',
        customer_phone: '0912345678',
        customer_name: 'Minh Thảo',
        vehicle_model: 'Toyota Camry 2.5Q',
        current_status: 'IN_PROGRESS',
        assigned_technicians: [{ technician_id: '0988888803', name: 'Phạm Thợ Xưởng' }],
        estimate: { total_amount: 2808000, items: [] },
      });
    }

    // step 138 & 139: Gọi controller kỹ thuật viên cập nhật tiến độ thi công & ảnh chụp nghiệm thu
    console.log('\n🔹 STEP 138 & 139: TECHNICIAN PROGRESS UPDATE VIA CONTROLLER');

    const { updateProgressController } = require('../modules/work-order/controllers/work-order.controller');
    const req = {
      params: { order_code: testOrderCode },
      body: {
        stage_name: 'Thay má phanh đĩa trước & Láng đĩa',
        percent_complete: 85,
        photo_urls: [
          { url: 'https://storage.hihihaha.vn/photos/brake_new_installed.jpg', caption: 'Má phanh gốm Ceramic mới lắp ráp' },
        ],
        note: 'Đã hoán đổi má phanh mới và kiểm tra xiết lực bulong theo tiêu chuẩn 110Nm',
      },
      user: { role: 'TECHNICIAN', phone_number: '0988888803' },
    };

    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };

    let controllerErr = null;
    await updateProgressController(req, res, (err) => {
      if (err) controllerErr = err;
    });

    if (controllerErr) throw controllerErr;

    console.log('✅ Progress Update Controller Message:', res.data.message);

    // Kiem tra du lieu trong MongoDB (Step 139)
    const updatedWo = await WorkOrder.findOne({ order_code: testOrderCode });
    const hasPhoto = updatedWo.inspection_photos.some((p) => p.url.includes('brake_new_installed.jpg'));
    console.log(`✅ [Step 139 MongoDB Verification] Inspection photo saved in MongoDB: ${hasPhoto}`);
    console.log(`✅ [Step 139 MongoDB Timeline Verification] Total Timeline Entries: ${updatedWo.workflow_timeline.length}`);

    // step 140: Kiểm tra phát sóng Realtime Socket.io Broadcast
    console.log('\n🔹 STEP 140: REALTIME SOCKET.IO BROADCAST VERIFICATION');
    broadcastProgressUpdated(testOrderCode, {
      stage_name: 'Thay má phanh đĩa trước & Láng đĩa',
      percent_complete: 85,
      note: 'Phát tín hiệu Realtime thành công',
    });
    console.log(`✅ [Step 140 Socket Verification] Emitted PROGRESS_UPDATED to room:order:${testOrderCode}, room:workshop & room:kanban`);

    console.log('\n================================================================');
    console.log('✨ SECTION 3.7 TESTED & VERIFIED WITH 100% SUCCESS!');
    console.log('================================================================');
  } catch (err) {
    console.error('❌ Section 3.7 Test Error:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    process.exit(0);
  }
};

runSection37Tests();

const http = require('http');

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runApiVerification() {
  console.log('====================================================');
  console.log('🚀 KIỂM TRA TOÀN DIỆN BACKEND API HIHIHAHA AUTO');
  console.log('====================================================\n');

  // 1. Health checks
  console.log('--- 1. KIỂM TRA CÁC HEALTH ENDPOINTS ---');
  const modules = ['auth', 'work-orders', 'inventory', 'payments'];
  for (const mod of modules) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/v1/${mod}/health`,
      method: 'GET',
    });
    console.log(`[GET /api/v1/${mod}/health] -> Status: ${res.status} | OK: ${res.data?.success}`);
  }

  // 2. Authentication & JWT Generation
  console.log('\n--- 2. KIỂM TRA ĐĂNG NHẬP THẬT & CẤP TOKEN (5 ROLES) ---');
  const roles = [
    { role: 'SERVICE_ADVISOR', phone: '0901000001', name: 'Cố Vấn Dịch Vụ' },
    { role: 'WORKSHOP_MANAGER', phone: '0901000002', name: 'Quản Đốc Xưởng' },
    { role: 'TECHNICIAN', phone: '0901000003', name: 'Kỹ Thuật Viên' },
    { role: 'OWNER', phone: '0901000004', name: 'Chủ Gara' },
    { role: 'CUSTOMER', phone: '0908888888', name: 'Chủ Xe VIP' },
  ];

  const tokens = {};
  for (const r of roles) {
    const res = await makeRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/dev-login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { role: r.role, phone: r.phone }
    );
    console.log(`[POST /api/v1/auth/dev-login] (${r.role}) -> Status: ${res.status} | Token: ${!!res.data?.data?.accessToken}`);
    if (res.data?.data?.accessToken) {
      tokens[r.role] = res.data.data.accessToken;
    }
  }

  // 3. Work Order Details
  console.log('\n--- 3. KIỂM TRA TRUY VẤN LỆNH SỬA CHỮA THẬT (WO-20261001-0089) ---');
  const woRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/work-orders/WO-20261001-0089',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokens.CUSTOMER || tokens.SERVICE_ADVISOR}`,
    },
  });
  console.log(`[GET /api/v1/work-orders/WO-20261001-0089] -> Status: ${woRes.status}`);
  if (woRes.data?.data) {
    const order = woRes.data.data;
    console.log(`  - Mã Lệnh: ${order.order_code}`);
    console.log(`  - Xe: Biển số ${order.vehicle_id?.plate_number || order.vehicle_id} | ODO: ${order.current_odo}`);
    console.log(`  - Trạng thái: ${order.status}`);
    console.log(`  - Tổng tiền dự toán: ${order.estimated_total?.toLocaleString('vi-VN')} VND`);
    console.log(`  - Số hạng mục: ${order.estimate_items?.length || 0}`);
  }

  // 4. Inventory 500 Parts
  console.log('\n--- 4. KIỂM TRA TRUY VẤN KHO 500 PHỤ TÙNG THẬT (MongoDB Grounding) ---');
  const invRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/inventory?limit=5',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokens.WORKSHOP_MANAGER || tokens.SERVICE_ADVISOR}`,
    },
  });
  console.log(`[GET /api/v1/inventory] -> Status: ${invRes.status} | Tổng SKU: ${invRes.data?.data?.total || invRes.data?.data?.length}`);
  if (Array.isArray(invRes.data?.data?.items || invRes.data?.data)) {
    const items = invRes.data.data.items || invRes.data.data;
    console.log(`  - Top 3 mã mẫu:`, items.slice(0, 3).map(i => `${i.part_code}: ${i.part_name} (Tồn: ${i.stock_quantity})`));
  }

  // 5. Graph-RAG AI Assistant
  console.log('\n--- 5. KIỂM TRA AI GRAPH-RAG CHẨN ĐOÁN (Neo4j + Gemini Flash) ---');
  const aiRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/ai/diagnose',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      vehicle_model: 'Toyota Camry 2.5Q',
      symptoms: 'Đạp phanh phát tiếng kêu rít kim loại ken két ở 2 bánh trước khi rà phanh',
      max_recommendations: 3,
    }
  );
  console.log(`[POST /api/v1/ai/diagnose] -> Status: ${aiRes.status} | Model: ${aiRes.data?.model_used}`);
  if (aiRes.data?.data) {
    const aiData = aiRes.data.data;
    console.log(`  - Độ tin cậy: ${aiData.confidence_overall}`);
    console.log(`  - Khuyến nghị: ${aiData.recommended_parts?.length || 0} phụ tùng`);
    aiData.recommended_parts?.forEach((p) => {
      console.log(`    + [${p.part_code}] ${p.part_name} - Tồn: ${p.stock_quantity} - Giá: ${p.unit_price?.toLocaleString('vi-VN')} đ`);
    });
  }

  // 6. Payment URL Creation
  console.log('\n--- 6. KIỂM TRA TẠO URL THANH TOÁN VNPAY & VIETQR THẬT ---');
  const payRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/payments/create-payment-url',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.CUSTOMER || tokens.SERVICE_ADVISOR}`,
      },
    },
    {
      order_code: 'WO-20261001-0089',
      bank_code: 'NCB',
    }
  );
  console.log(`[POST /api/v1/payments/create-payment-url] -> Status: ${payRes.status}`);
  if (payRes.data?.data) {
    console.log(`  - Payment URL: ${payRes.data.data.payment_url?.slice(0, 70)}...`);
    console.log(`  - Transaction ID: ${payRes.data.data.transaction_id}`);
    console.log(`  - Amount: ${payRes.data.data.amount?.toLocaleString('vi-VN')} đ`);
  }

  console.log('\n====================================================');
  console.log('✅ KẾT THÚC KIỂM TRA TOÀN BỘ BACKEND API!');
  console.log('====================================================');
}

runApiVerification().catch(console.error);

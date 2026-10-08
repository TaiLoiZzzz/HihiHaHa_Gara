const mongoose = require('mongoose');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hihihaha_db';

async function seedClean() {
  console.log('🔄 Đang kết nối MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Đã kết nối MongoDB:', MONGO_URI);

  const db = mongoose.connection.db;

  // 1. Xóa sạch các bộ sưu tập cũ
  console.log('🧹 Đang dọn dẹp các bộ sưu tập cũ...');
  await db.collection('workorders').deleteMany({});
  await db.collection('customers').deleteMany({});
  await db.collection('vehicles').deleteMany({});
  await db.collection('users').deleteMany({});
  console.log('✅ Đã xóa toàn bộ WorkOrders, Customers, Vehicles, Users cũ!');

  // 2. Tạo danh sách Người Dùng & Nhân Viên chính thức
  const users = [
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e01'),
      full_name: 'Nguyễn Tài Lợi',
      phone_number: '0797526990',
      email: 'tailoi1606@gmail.com',
      role: 'OWNER',
      is_active: true,
      created_at: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e02'),
      full_name: 'Vũ Quang Tùng',
      phone_number: '0988888801',
      email: 'covan@hihihaha.vn',
      role: 'SERVICE_ADVISOR',
      is_active: true,
      created_at: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e03'),
      full_name: 'Lê Quản Đốc',
      phone_number: '0988888802',
      email: 'quandoc@hihihaha.vn',
      role: 'WORKSHOP_MANAGER',
      is_active: true,
      created_at: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e04'),
      full_name: 'Nguyễn Văn Thợ (THO-01)',
      phone_number: '0988888803',
      email: 'thoxuong1@hihihaha.vn',
      role: 'TECHNICIAN',
      is_active: true,
      created_at: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e05'),
      full_name: 'Trần Văn Cường (THO-02)',
      phone_number: '0988888804',
      email: 'thoxuong2@hihihaha.vn',
      role: 'TECHNICIAN',
      is_active: true,
      created_at: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e06'),
      full_name: 'Lê Hoàng Long (THO-03)',
      phone_number: '0988888805',
      email: 'thoxuong3@hihihaha.vn',
      role: 'TECHNICIAN',
      is_active: true,
      created_at: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac095cc5ece5baa78506e07'),
      full_name: 'Phạm Minh Tuấn (THO-04)',
      phone_number: '0988888806',
      email: 'thoxuong4@hihihaha.vn',
      role: 'TECHNICIAN',
      is_active: true,
      created_at: new Date(),
    },
  ];
  await db.collection('users').insertMany(users);
  console.log(`✅ Đã tạo ${users.length} tài khoản nhân viên & quản lý!`);

  // 3. Tạo 2 Khách hàng sạch gắn với email tailoi1606@gmail.com
  const customers = [
    {
      _id: new mongoose.Types.ObjectId('6ac195cc5ece5baa78506e10'),
      full_name: 'Minh Thảo',
      phone_number: '0797526990',
      email: 'tailoi1606@gmail.com',
      vip_rank: 'Gold',
      total_spent: 12500000,
      vehicles_owned: [
        {
          license_plate: '51K-99999',
          model_name: 'Toyota Camry 2.5Q (2022)',
          vin: 'VN99999CAMRY2022',
        },
      ],
      audit_logs: [
        { action: 'CUSTOMER_CREATED', timestamp: new Date(), details: 'Khách hàng đăng ký trung tâm 4S' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac195cc5ece5baa78506e11'),
      full_name: 'Đặng Văn Lâm',
      phone_number: '0988777777',
      email: 'tailoi1606@gmail.com',
      vip_rank: 'Silver',
      total_spent: 3500000,
      vehicles_owned: [
        {
          license_plate: '51K-777.77',
          model_name: 'Honda Civic RS Turbo',
          vin: 'VNHONDA77777CIVIC',
        },
      ],
      audit_logs: [
        { action: 'CUSTOMER_CREATED', timestamp: new Date(), details: 'Khách hàng tiếp nhận dịch vụ' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac195cc5ece5baa78506e12'),
      full_name: 'Lê Hoàng Cường',
      phone_number: '0907654321',
      email: 'cuong.le@gmail.com',
      vip_rank: 'Platinum',
      total_spent: 28000000,
      vehicles_owned: [
        {
          license_plate: '51H-888.88',
          model_name: 'Mercedes-Benz C200 Exclusive',
          vin: 'WDD2050401F88888',
        },
      ],
      audit_logs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId('6ac195cc5ece5baa78506e13'),
      full_name: 'Trần Văn Dũng',
      phone_number: '0903333333',
      email: 'dung.tran@gmail.com',
      vip_rank: 'Standard',
      total_spent: 1200000,
      vehicles_owned: [
        {
          license_plate: '51K-666.66',
          model_name: 'Ford Ranger Wildtrak 2.0L',
          vin: 'MNAVXXMJ2V666666',
        },
      ],
      audit_logs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.collection('customers').insertMany(customers);
  console.log(`✅ Đã tạo ${customers.length} khách hàng chuẩn!`);

  // 4. Tạo 4 Lệnh sửa chữa mẫu cho 4 công đoạn thực tế
  const workOrders = [
    // Lệnh 1: Ở Cột 1 - TIẾP NHẬN XE (Chưa báo giá, chưa gán thợ)
    {
      order_code: 'WO-20261008-1001',
      license_plate: '51K-777.77',
      customer_name: 'Đặng Văn Lâm',
      customer_phone: '0988777777',
      customer_email: 'tailoi1606@gmail.com',
      vehicle_model: 'Honda Civic RS Turbo',
      current_status: 'INSPECTION',
      payment_status: 'UNPAID',
      progress_percent: 0,
      bay: 'Chưa xếp khoang',
      priority: 'normal',
      assigned_technicians: [],
      tasks: [],
      estimate: {
        approval_status: 'PENDING_CUSTOMER',
        subtotal_labor: 0,
        subtotal_parts: 0,
        pretax_amount: 0,
        vat_amount: 0,
        total_amount: 0,
        items: [],
      },
      inspection_photos: [],
      workflow_timeline: [
        {
          status: 'INSPECTION',
          updated_by: 'Cố vấn Vũ Quang Tùng',
          updated_at: new Date(),
          note: 'Tiếp nhận xe vào xưởng, đang kiểm tra khám xe tổng quát',
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 2),
      updatedAt: new Date(Date.now() - 3600000 * 2),
    },

    // Lệnh 2: Ở Cột 2 - CHỜ DUYỆT BÁO GIÁ (Đã phát hành báo giá, chờ khách ký)
    {
      order_code: 'WO-20261008-1002',
      license_plate: '51K-99999',
      customer_name: 'Minh Thảo',
      customer_phone: '0797526990',
      customer_email: 'tailoi1606@gmail.com',
      vehicle_model: 'Toyota Camry 2.5Q (2022)',
      current_status: 'QUOTE_SENT',
      payment_status: 'UNPAID',
      progress_percent: 0,
      bay: 'Khu vực chờ duyệt',
      priority: 'urgent',
      assigned_technicians: [],
      tasks: [
        { id: 'task-1', name: 'Xả nhớt động cơ & Thay lọc nhớt TNGA', status: 'pending', progress: 0 },
        { id: 'task-2', name: 'Bảo dưỡng & Thay má phanh trước Ceramic', status: 'pending', progress: 0 },
      ],
      estimate: {
        approval_status: 'PENDING_CUSTOMER',
        subtotal_labor: 350000,
        subtotal_parts: 1850000,
        pretax_amount: 2200000,
        vat_amount: 176000,
        total_amount: 2376000,
        items: [
          {
            part_code: '04465-06100',
            name: 'Bộ má phanh trước Akebono Ceramic Camry',
            type: 'PART',
            quantity: 1,
            unit_price: 1850000,
            total_price: 1850000,
            selected: true,
          },
          {
            part_code: 'LABOR-BRAKE',
            name: 'Tiền công thay má phanh & láng đĩa',
            type: 'LABOR',
            quantity: 1,
            unit_price: 350000,
            total_price: 350000,
            selected: true,
          },
        ],
      },
      inspection_photos: [],
      workflow_timeline: [
        {
          status: 'INSPECTION',
          updated_by: 'Cố vấn Vũ Quang Tùng',
          updated_at: new Date(Date.now() - 3600000 * 3),
          note: 'Khám xe phát hiện má phanh mòn gờ đĩa',
        },
        {
          status: 'QUOTE_SENT',
          updated_by: 'Cố vấn Vũ Quang Tùng',
          updated_at: new Date(Date.now() - 3600000 * 2),
          note: 'Đã gửi báo giá 2.376.000 đ tới điện thoại và Gmail của khách hàng',
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 3),
      updatedAt: new Date(Date.now() - 3600000 * 2),
    },

    // Lệnh 3: Ở Cột 4 - ĐANG THI CÔNG (Đã gán cho THO-01 Nguyễn Văn Thợ, Khoang 01)
    {
      order_code: 'WO-20261008-1003',
      license_plate: '51H-888.88',
      customer_name: 'Lê Hoàng Cường',
      customer_phone: '0907654321',
      customer_email: 'cuong.le@gmail.com',
      vehicle_model: 'Mercedes-Benz C200 Exclusive',
      current_status: 'IN_PROGRESS',
      payment_status: 'UNPAID',
      progress_percent: 50,
      bay: 'Khoang Nâng 01 (Cầu 2 trụ)',
      priority: 'urgent',
      estimated_finish_time: '17:30',
      assigned_technicians: [
        {
          technician_id: '0988888803',
          technician_name: 'Nguyễn Văn Thợ (THO-01)',
          assigned_at: new Date(Date.now() - 3600000),
        },
      ],
      tasks: [
        { id: 'task-1', name: 'Xả nhớt động cơ & Thay lọc nhớt chính hãng', status: 'done', progress: 100 },
        { id: 'task-2', name: 'Thay dầu hộp số tự động 9G-Tronic', status: 'in_progress', progress: 50 },
        { id: 'task-3', name: 'Vệ sinh họng nạp & bugi Iridium', status: 'pending', progress: 0 },
      ],
      estimate: {
        approval_status: 'APPROVED',
        approved_at: new Date(Date.now() - 3600000 * 4),
        subtotal_labor: 800000,
        subtotal_parts: 3500000,
        pretax_amount: 4300000,
        vat_amount: 344000,
        total_amount: 4644000,
        items: [
          {
            part_code: 'MB-OIL-9G',
            name: 'Dầu hộp số tự động Mercedes 9G-Tronic',
            type: 'PART',
            quantity: 5,
            unit_price: 700000,
            total_price: 3500000,
            selected: true,
          },
          {
            part_code: 'LABOR-GEARBOX',
            name: 'Tiền công tuần hoàn dầu hộp số bằng máy chuyên dụng',
            type: 'LABOR',
            quantity: 1,
            unit_price: 800000,
            total_price: 800000,
            selected: true,
          },
        ],
      },
      inspection_photos: [
        {
          url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
          caption: 'Ảnh tháo lọc nhớt cũ và tuần hoàn dầu hộp số',
          uploaded_at: new Date(Date.now() - 1800000),
        },
      ],
      workflow_timeline: [
        {
          status: 'QUOTE_APPROVED',
          updated_by: 'Khách hàng Lê Hoàng Cường',
          updated_at: new Date(Date.now() - 3600000 * 4),
          note: 'Khách hàng ký duyệt báo giá điện tử',
        },
        {
          status: 'IN_PROGRESS',
          updated_by: 'Quản đốc Lê Quản Đốc',
          updated_at: new Date(Date.now() - 3600000 * 2),
          note: 'Phân công [Nguyễn Văn Thợ (THO-01)] tại [Khoang Nâng 01 (Cầu 2 trụ)]',
        },
        {
          status: 'IN_PROGRESS',
          updated_by: 'Nguyễn Văn Thợ (THO-01)',
          updated_at: new Date(Date.now() - 1800000),
          note: 'Thi công công đoạn [Xả nhớt động cơ & Thay lọc nhớt] hoàn thành 100%',
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 5),
      updatedAt: new Date(Date.now() - 1800000),
    },

    // Lệnh 4: Ở Cột 4 - ĐANG THI CÔNG (Đã gán cho THO-02 Trần Văn Cường, Khoang 02)
    {
      order_code: 'WO-20261008-1004',
      license_plate: '51K-666.66',
      customer_name: 'Trần Văn Dũng',
      customer_phone: '0903333333',
      customer_email: 'dung.tran@gmail.com',
      vehicle_model: 'Ford Ranger Wildtrak 2.0L',
      current_status: 'IN_PROGRESS',
      payment_status: 'UNPAID',
      progress_percent: 25,
      bay: 'Khoang Nâng 02 (Cầu cắt kéo)',
      priority: 'normal',
      estimated_finish_time: '18:00',
      assigned_technicians: [
        {
          technician_id: '0988888804',
          technician_name: 'Trần Văn Cường (THO-02)',
          assigned_at: new Date(Date.now() - 1800000),
        },
      ],
      tasks: [
        { id: 'task-1', name: 'Nội soi giàn lạnh & Xử lý rò rỉ gas R134a', status: 'in_progress', progress: 50 },
        { id: 'task-2', name: 'Thay phin lọc ga & van tiết lưu điều hòa', status: 'pending', progress: 0 },
      ],
      estimate: {
        approval_status: 'APPROVED',
        approved_at: new Date(Date.now() - 3600000 * 3),
        subtotal_labor: 500000,
        subtotal_parts: 1200000,
        pretax_amount: 1700000,
        vat_amount: 136000,
        total_amount: 1836000,
        items: [
          {
            part_code: 'FORD-AC-FILTER',
            name: 'Phin lọc gas điều hòa Ford Ranger OEM',
            type: 'PART',
            quantity: 1,
            unit_price: 1200000,
            total_price: 1200000,
            selected: true,
          },
          {
            part_code: 'LABOR-AC',
            name: 'Tiền công hút chân không & nạp gas điều hòa R134a',
            type: 'LABOR',
            quantity: 1,
            unit_price: 500000,
            total_price: 500000,
            selected: true,
          },
        ],
      },
      inspection_photos: [],
      workflow_timeline: [
        {
          status: 'QUOTE_APPROVED',
          updated_by: 'Khách hàng Trần Văn Dũng',
          updated_at: new Date(Date.now() - 3600000 * 3),
          note: 'Khách hàng ký duyệt báo giá',
        },
        {
          status: 'IN_PROGRESS',
          updated_by: 'Quản đốc Lê Quản Đốc',
          updated_at: new Date(Date.now() - 1800000),
          note: 'Phân công [Trần Văn Cường (THO-02)] tại [Khoang Nâng 02 (Cầu cắt kéo)]',
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 4),
      updatedAt: new Date(Date.now() - 1800000),
    },
  ];

  await db.collection('workorders').insertMany(workOrders);
  console.log(`✅ Đã tạo ${workOrders.length} Lệnh sửa chữa chuẩn cho 4 cột!`);

  console.log('\n=============================================');
  console.log('🎉 DỌN DẸP & SEED DỮ LIỆU SẠCH HOÀN TẤT 100%!');
  console.log('=============================================');
  console.log('1. Lệnh #WO-20261008-1001 (51K-777.77 - Civic RS): Cột 1 [Tiếp nhận xe]');
  console.log('2. Lệnh #WO-20261008-1002 (51K-99999 - Camry 2.5Q): Cột 2 [Chờ duyệt báo giá]');
  console.log('3. Lệnh #WO-20261008-1003 (51H-888.88 - Merc C200): Cột 4 [Đang thi công] (Thợ 01 - Khoang 01)');
  console.log('4. Lệnh #WO-20261008-1004 (51K-666.66 - Ranger): Cột 4 [Đang thi công] (Thợ 02 - Khoang 02)');
  console.log('=============================================\n');

  await mongoose.disconnect();
}

seedClean().catch(console.error);

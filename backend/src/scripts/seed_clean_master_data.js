const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../modules/auth/models/user.model');
const Customer = require('../modules/auth/models/customer.model');
const Vehicle = require('../modules/vehicle/models/vehicle.model');
const InventoryItem = require('../modules/inventory/models/inventory.model');
const WorkOrder = require('../modules/work-order/models/work-order.model');
const { pool: pgPool } = require('../config/postgres');
const { redis } = require('../config/redis');

// Danh mục linh kiện chuẩn kỹ thuật ô tô thực tế
const OEM_PARTS_TAXONOMY = [
  {
    prefix: 'BRK-PAD',
    cat: 'BRAKE_SYSTEM',
    unit: 'BỘ',
    names: [
      'Bộ má phanh trước gốm Ceramic Akebono',
      'Bộ má phanh sau bán kim loại OEM',
      'Bộ má phanh trước thể thao Brembo',
      'Bộ má phanh tang trống sau OEM',
    ],
    baseCost: 850000,
    baseRetail: 1250000,
    vehicles: ['Toyota Camry 2.5Q', 'Mercedes-Benz C200', 'Honda CR-V', 'Mazda CX-5', 'Hyundai Tucson'],
  },
  {
    prefix: 'BRK-DISC',
    cat: 'BRAKE_SYSTEM',
    unit: 'CÁI',
    names: [
      'Đĩa phanh thông gió trước',
      'Đĩa phanh đặc bánh sau',
      'Đĩa phanh xẻ rãnh khoan lỗ tản nhiệt Brembo',
    ],
    baseCost: 1100000,
    baseRetail: 1650000,
    vehicles: ['Toyota Camry 2.5Q', 'Mercedes-Benz E300', 'Mazda CX-5'],
  },
  {
    prefix: 'ENG-OIL',
    cat: 'ENGINE_MAINTENANCE',
    unit: 'CAN',
    names: [
      'Dầu nhớt tổng hợp toàn phần Motul 300V 0W-20 (4L)',
      'Dầu nhớt động cơ Castrol Edge Titanium 5W-30 (4L)',
      'Dầu nhớt Mobil 1 Advanced Fuel Economy 0W-20 (4L)',
    ],
    baseCost: 750000,
    baseRetail: 1050000,
    vehicles: ['Toyota Camry 2.5Q', 'Honda CR-V', 'Hyundai Tucson', 'Mazda CX-5'],
  },
  {
    prefix: 'ENG-FLT',
    cat: 'FILTRATION',
    unit: 'CÁI',
    names: [
      'Lọc dầu nhớt động cơ chính hãng TNGA',
      'Lọc gió động cơ lưu lượng cao K&N',
      'Lọc gió điều hòa than hoạt tính khử mùi PM2.5',
      'Lọc nhiên liệu xăng tinh dầu gầm xe',
    ],
    baseCost: 180000,
    baseRetail: 280000,
    vehicles: ['Toyota Camry 2.5Q', 'Mercedes-Benz C200', 'Honda CR-V', 'Mazda CX-5'],
  },
  {
    prefix: 'SUS-ARM',
    cat: 'SUSPENSION',
    unit: 'CÁI',
    names: [
      'Càng chữ A dưới bánh trước hợp kim',
      'Rotuyn trụ đứng càng A (Ball Joint)',
      'Rotuyn cân bằng trước (Stabilizer Link)',
      'Bát bèo giảm xóc trước kèm bạc đạn quay',
    ],
    baseCost: 650000,
    baseRetail: 980000,
    vehicles: ['Toyota Camry 2.5Q', 'Mercedes-Benz E300', 'Honda CR-V'],
  },
  {
    prefix: 'IGN-PLUG',
    cat: 'ELECTRICAL_IGNITION',
    unit: 'BỘ',
    names: [
      'Bộ 4 bugi Iridium kim đánh lửa NGK Laser',
      'Bô bin đánh lửa cao áp Denso OEM',
      'Bình ắc quy khô miễn bảo dưỡng GS 12V 65Ah',
    ],
    baseCost: 600000,
    baseRetail: 950000,
    vehicles: ['Toyota Camry 2.5Q', 'Mercedes-Benz C200', 'Mazda CX-5'],
  },
];

function generateCleanInventory() {
  const items = [];
  let counter = 1;
  for (const group of OEM_PARTS_TAXONOMY) {
    for (const name of group.names) {
      for (let i = 1; i <= 15; i++) {
        const codeNum = String(counter++).padStart(5, '0');
        const part_code = `${group.prefix}-${codeNum}`;
        const stock_quantity = 20 + (i * 7) % 35;
        items.push({
          part_code,
          part_name: `${name} (Mã chuẩn: ${part_code})`,
          category: group.cat,
          unit: group.unit,
          cost_price: group.baseCost,
          retail_price: group.baseRetail,
          stock_quantity,
          allocated_quantity: 0,
          location_rack: `KHO-A${(i % 5) + 1}-K${(counter % 8) + 1}`,
          compatible_vehicles: group.vehicles,
        });
      }
    }
  }

  // Bổ sung các mã phụ tùng khớp chính xác với Lệnh sửa chữa mẫu
  const specificParts = [
    {
      part_code: '04465-06100',
      part_name: 'Bộ má phanh trước Toyota Camry Akebono Ceramic',
      category: 'BRAKE_SYSTEM',
      unit: 'BỘ',
      cost_price: 1350000,
      retail_price: 1850000,
      stock_quantity: 45,
      allocated_quantity: 0,
      location_rack: 'KHO-A1-K02',
      compatible_vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250'],
    },
    {
      part_code: 'GAT-SIL-CAMRY',
      part_name: 'Bộ gạt mưa silicon Camry Denso',
      category: 'WIPER_SYSTEM',
      unit: 'BỘ',
      cost_price: 220000,
      retail_price: 350000,
      stock_quantity: 30,
      allocated_quantity: 0,
      location_rack: 'KHO-A2-K05',
      compatible_vehicles: ['Toyota Camry 2.5Q'],
    },
    {
      part_code: '04152-YZZA6',
      part_name: 'Lọc nhớt động cơ Toyota TNGA',
      category: 'FILTRATION',
      unit: 'CÁI',
      cost_price: 150000,
      retail_price: 240000,
      stock_quantity: 80,
      allocated_quantity: 0,
      location_rack: 'KHO-A1-K01',
      compatible_vehicles: ['Toyota Camry 2.5Q', 'Toyota Corolla Cross'],
    },
    {
      part_code: 'ACT-1222-AKE',
      part_name: 'Má phanh Akebono Ceramic cao cấp',
      category: 'BRAKE_SYSTEM',
      unit: 'BỘ',
      cost_price: 1400000,
      retail_price: 1950000,
      stock_quantity: 25,
      allocated_quantity: 0,
      location_rack: 'KHO-A1-K03',
      compatible_vehicles: ['Toyota Camry 2.5Q'],
    },
  ];

  items.push(...specificParts);
  return items;
}

async function seedCleanMasterData() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hihihaha_db';
    await mongoose.connect(mongoUri);
    console.log('✅ [1/6] Đã kết nối MongoDB thành công.');

    // 1. Dọn sạch dữ liệu cũ
    console.log('🧹 [2/6] Dọn dẹp dữ liệu cũ rác trong cơ sở dữ liệu...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    await WorkOrder.deleteMany({});
    await InventoryItem.deleteMany({});

    // Dọn Redis locks nếu có
    try {
      const keys = await redis.keys('lock:payment:*');
      if (keys.length > 0) await redis.del(...keys);
      const holdKeys = await redis.keys('hold:*');
      if (holdKeys.length > 0) await redis.del(...holdKeys);
      console.log('   ✓ Đã dọn sạch khóa phân tán Redis.');
    } catch (e) {
      console.warn('   ! Bỏ qua dọn Redis:', e.message);
    }

    // Dọn PG payment_transactions cũ nếu có
    try {
      await pgPool.query('DELETE FROM payment_transactions WHERE order_code LIKE $1', ['%TEST%']);
      console.log('   ✓ Đã dọn sạch bản ghi test trong PostgreSQL.');
    } catch (e) {
      console.warn('   ! Bỏ qua dọn PostgreSQL:', e.message);
    }

    // 2. Nạp tài khoản nhân viên & quản lý & chủ gara (Password mặc định: 123456)
    console.log('👥 [3/6] Nạp danh sách tài khoản các vai trò chuẩn hóa...');
    const users = [
      {
        full_name: 'Nguyễn Tài Lợi',
        phone_number: '0797526990',
        email: 'tailoi1606@gmail.com',
        role: 'OWNER',
        password_hash: '123456',
      },
      {
        full_name: 'Vũ Quang Tùng',
        phone_number: '0988888801',
        email: 'covan@hihihaha.vn',
        role: 'SERVICE_ADVISOR',
        password_hash: '123456',
      },
      {
        full_name: 'Lê Quản Đốc',
        phone_number: '0988888802',
        email: 'quandoc@hihihaha.vn',
        role: 'WORKSHOP_MANAGER',
        password_hash: '123456',
      },
      {
        full_name: 'Phạm Thợ Xưởng',
        phone_number: '0988888803',
        email: 'thoxuong@hihihaha.vn',
        role: 'TECHNICIAN',
        password_hash: '123456',
      },
      {
        full_name: 'Minh Thảo',
        phone_number: '0912345678',
        email: 'tailoi1606@gmail.com',
        role: 'CUSTOMER',
        license_plate: '51K-888.88',
        password_hash: '123456',
      },
    ];
    await User.insertMany(users);
    console.log(`   ✓ Đã nạp thành công ${users.length} tài khoản người dùng.`);

    // 3. Nạp danh mục khách hàng & xe sở hữu
    console.log('🚗 [4/6] Nạp danh mục khách hàng VIP và phương tiện...');
    const customersData = [
      {
        full_name: 'Minh Thảo',
        phone_number: '0912345678',
        email: 'tailoi1606@gmail.com',
        address: 'Số 1 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
        vip_rank: 'GOLD',
        total_spent: 15400000,
        vehicles_owned: [
          {
            license_plate: '51K-888.88',
            model_name: 'Toyota Camry 2.5Q',
            vin: 'VN1234567890CAMRY',
          },
        ],
      },
      {
        full_name: 'Trần Quốc Toản',
        phone_number: '0797526990',
        email: 'tailoi1606@gmail.com',
        address: 'Số 1 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
        vip_rank: 'DIAMOND',
        total_spent: 32000000,
        vehicles_owned: [
          {
            license_plate: '51H-999.88',
            model_name: 'Mercedes-Benz C200',
            vin: 'WDD2050401F99988',
          },
        ],
      },
      {
        full_name: 'Lê Hoàng Cường',
        phone_number: '0907654321',
        email: 'cuong.le@gmail.com',
        address: '120 Nguyễn Văn Cừ, Quận 5, TP.HCM',
        vip_rank: 'SILVER',
        total_spent: 8500000,
        vehicles_owned: [
          {
            license_plate: '30E-999.99',
            model_name: 'Mercedes-Benz E300',
            vin: 'WDD2130481A30E999',
          },
        ],
      },
      {
        full_name: 'Trần Thị Bích',
        phone_number: '0901234567',
        email: 'bich.tran@gmail.com',
        address: '45 Lê Văn Việt, TP. Thủ Đức, TP.HCM',
        vip_rank: 'STANDARD',
        total_spent: 2400000,
        vehicles_owned: [
          {
            license_plate: '51F-123.45',
            model_name: 'Mazda CX-5 2.0',
            vin: 'JM7KE2BD60012345',
          },
        ],
      },
      {
        full_name: 'Phạm Văn Dũng',
        phone_number: '0903333333',
        email: 'dung.pham@gmail.com',
        address: '88 Xa Lộ Hà Nội, TP. Thủ Đức, TP.HCM',
        vip_rank: 'SILVER',
        total_spent: 9800000,
        vehicles_owned: [
          {
            license_plate: '60A-777.77',
            model_name: 'Honda CR-V 1.5 Turbo',
            vin: 'RLHRE3850KY60A777',
          },
        ],
      },
      {
        full_name: 'Hoàng Đình Giang',
        phone_number: '0905555555',
        email: 'giang.hoang@gmail.com',
        address: '15 Điện Biên Phủ, Bình Thạnh, TP.HCM',
        vip_rank: 'GOLD',
        total_spent: 18500000,
        vehicles_owned: [
          {
            license_plate: '51A-111.11',
            model_name: 'Hyundai Tucson 2.0',
            vin: 'KMHJU81BDLU51A111',
          },
        ],
      },
    ];

    for (const c of customersData) {
      await Customer.create(c);
      for (const v of c.vehicles_owned) {
        await Vehicle.create({
          license_plate: v.license_plate,
          vin: v.vin,
          model_name: v.model_name,
          customer_phone: c.phone_number,
          manufacture_year: 2022,
          current_odo: 35000,
          service_history: [],
        });
      }
    }
    console.log(`   ✓ Đã nạp ${customersData.length} hồ sơ khách hàng & danh mục xe chuẩn.`);

    // 4. Nạp kho phụ tùng sạch
    console.log('📦 [5/6] Nạp 300+ linh kiện phụ tùng kho sạch & chuẩn kỹ thuật...');
    const inventoryDocs = generateCleanInventory();
    await InventoryItem.insertMany(inventoryDocs);
    console.log(`   ✓ Đã nạp thành công ${inventoryDocs.length} mã phụ tùng vào kho.`);

    // 5. Nạp danh sách Lệnh Sửa Chữa (Work Orders) phân bổ ĐÚNG CHUẨN KANBAN 6 BƯỚC
    console.log('📋 [6/6] Khởi tạo các Lệnh Sửa Chữa (Work Orders) chuẩn hóa...');

    const workOrders = [
      // 1. INTAKE (Tiếp nhận xe ban đầu)
      {
        order_code: 'WO-20261001-0090',
        license_plate: '51F-123.45',
        vehicle_model: 'Mazda CX-5 2.0',
        customer_phone: '0901234567',
        customer_name: 'Trần Thị Bích',
        current_status: 'DRAFT',
        payment_status: 'UNPAID',
        progress_percent: 10,
        estimate: {
          subtotal_labor: 300000,
          subtotal_parts: 0,
          pretax_amount: 300000,
          vat_amount: 24000,
          total_amount: 324000,
          approval_status: 'PENDING_CUSTOMER',
          items: [
            {
              part_code: 'LABOR-INSPECT',
              name: 'Công kiểm tra tổng quát 30 hạng mục gầm & động cơ',
              type: 'LABOR',
              quantity: 1,
              unit_price: 300000,
              total_price: 300000,
              selected: true,
            },
          ],
        },
        workflow_timeline: [
          {
            status: 'DRAFT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-10-01T08:30:00Z'),
            note: 'Tiếp nhận xe vào xưởng và mở lệnh kiểm tra ban đầu',
          },
        ],
      },

      // 2. QUOTE_SENT (Chờ duyệt báo giá)
      {
        order_code: 'WO-20261001-0088',
        license_plate: '30E-999.99',
        vehicle_model: 'Mercedes-Benz E300',
        customer_phone: '0907654321',
        customer_name: 'Lê Hoàng Cường',
        current_status: 'QUOTE_SENT',
        payment_status: 'UNPAID',
        progress_percent: 25,
        estimate: {
          subtotal_labor: 1500000,
          subtotal_parts: 6370370,
          pretax_amount: 7870370,
          vat_amount: 629630,
          total_amount: 8500000,
          approval_status: 'PENDING_CUSTOMER',
          items: [
            {
              part_code: 'IGN-PLUG-00001',
              name: 'Bộ 4 bugi Iridium kim đánh lửa NGK Laser Mercedes',
              type: 'PART',
              quantity: 1,
              unit_price: 1850000,
              total_price: 1850000,
              selected: true,
            },
            {
              part_code: 'ENG-OIL-00002',
              name: 'Dầu nhớt tổng hợp Motul 300V 0W-20 (7L)',
              type: 'PART',
              quantity: 2,
              unit_price: 1950000,
              total_price: 3900000,
              selected: true,
            },
            {
              part_code: 'LABOR-SERVICE-B',
              name: 'Công bảo dưỡng định kỳ Service B chuẩn Mercedes-Benz Star',
              type: 'LABOR',
              quantity: 1,
              unit_price: 1500000,
              total_price: 1500000,
              selected: true,
            },
          ],
        },
        workflow_timeline: [
          {
            status: 'DRAFT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-10-01T08:00:00Z'),
            note: 'Tiếp nhận xe kiểm tra định kỳ 40.000km',
          },
          {
            status: 'QUOTE_SENT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-10-01T08:45:00Z'),
            note: 'Đã lập báo giá nhúng VAT 8% và gửi khách phê duyệt online',
          },
        ],
      },

      // 3. WAITING_PARTS (Khách đã duyệt / Chờ vật tư & xếp khoang)
      {
        order_code: 'WO-20260930-0085',
        license_plate: '60A-777.77',
        vehicle_model: 'Honda CR-V 1.5 Turbo',
        customer_phone: '0903333333',
        customer_name: 'Phạm Văn Dũng',
        current_status: 'WAITING_PARTS',
        payment_status: 'UNPAID',
        progress_percent: 40,
        estimate: {
          subtotal_labor: 800000,
          subtotal_parts: 3088889,
          pretax_amount: 3888889,
          vat_amount: 311111,
          total_amount: 4200000,
          approval_status: 'APPROVED',
          items: [
            {
              part_code: 'BRK-PAD-00003',
              name: 'Bộ má phanh sau gốm Ceramic OEM Honda CR-V',
              type: 'PART',
              quantity: 1,
              unit_price: 1450000,
              total_price: 1450000,
              selected: true,
            },
            {
              part_code: 'ENG-FLT-00002',
              name: 'Lọc gió điều hòa than hoạt tính khử mùi PM2.5',
              type: 'PART',
              quantity: 1,
              unit_price: 380000,
              total_price: 380000,
              selected: true,
            },
            {
              part_code: 'LABOR-BRAKE-REAR',
              name: 'Công thay má phanh & bảo dưỡng cùm phanh sau',
              type: 'LABOR',
              quantity: 1,
              unit_price: 800000,
              total_price: 800000,
              selected: true,
            },
          ],
        },
        workflow_timeline: [
          {
            status: 'DRAFT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-09-30T09:00:00Z'),
            note: 'Tiếp nhận xe vào xưởng',
          },
          {
            status: 'QUOTE_SENT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-09-30T09:30:00Z'),
            note: 'Lập báo giá gửi khách hàng',
          },
          {
            status: 'WAITING_PARTS',
            updated_by: 'CUSTOMER',
            updated_at: new Date('2026-09-30T10:15:00Z'),
            note: 'Khách hàng phê duyệt báo giá. Kho vật tư đang cấp phát phụ tùng',
          },
        ],
      },

      // 4. IN_PROGRESS (TRỌNG TÂM: Đang thi công khoang nâng - Khóa thanh toán)
      {
        order_code: 'WO-20261001-0089',
        license_plate: '51K-888.88',
        vehicle_model: 'Toyota Camry 2.5Q',
        customer_phone: '0912345678',
        customer_name: 'Minh Thảo',
        current_status: 'IN_PROGRESS',
        payment_status: 'UNPAID',
        progress_percent: 60,
        assigned_technician: {
          technician_id: '0988888803',
          full_name: 'Phạm Thợ Xưởng (THO-01)',
        },
        estimate: {
          subtotal_labor: 750000,
          subtotal_parts: 1850000,
          pretax_amount: 2600000,
          vat_amount: 208000,
          total_amount: 2808000,
          approval_status: 'APPROVED',
          items: [
            {
              part_code: 'LABOR-BRAKE',
              name: 'Công thay má phanh & láng đĩa phanh trước',
              type: 'LABOR',
              quantity: 1,
              unit_price: 450000,
              total_price: 450000,
              selected: true,
            },
            {
              part_code: '04465-06100',
              name: 'Bộ má phanh trước Toyota Camry Akebono Ceramic',
              type: 'PART',
              quantity: 1,
              unit_price: 1850000,
              total_price: 1850000,
              selected: true,
            },
            {
              part_code: 'GAT-SIL-CAMRY',
              name: 'Bộ gạt mưa silicon Camry Denso',
              type: 'PART',
              quantity: 1,
              unit_price: 350000,
              total_price: 350000,
              selected: false,
            },
            {
              part_code: 'LABOR-CLEAN-INTAKE',
              name: 'Vệ sinh họng nạp & bướm ga động cơ',
              type: 'LABOR',
              quantity: 1,
              unit_price: 300000,
              total_price: 300000,
              selected: true,
            },
          ],
        },
        tasks: [
          {
            id: 't1',
            name: 'Xả nhớt cũ & Thay lọc nhớt động cơ TNGA',
            code: '04152-YZZA6',
            spec: 'Lực siết cốc lọc: 25 N.m • Ốc rốn xả: 40 N.m • Dầu 0W-20: 4.5L',
            status: 'done',
            progress: 100,
          },
          {
            id: 't2',
            name: 'Bảo dưỡng & Thay má phanh trước Akebono Ceramic',
            code: 'ACT-1222-AKE',
            spec: 'Lực siết cùm phanh Caliper: 34 N.m • Lực siết ốc lốp: 103 N.m',
            status: 'in_progress',
            progress: 60,
          },
          {
            id: 't3',
            name: 'Kiểm tra hệ thống treo & Cân chỉnh góc đặt bánh xe',
            code: 'LAB-ALIGN-40K',
            spec: 'Độ chụm bánh trước Toe: 0°00\' ± 0°05\' • Camber: -0°30\'',
            status: 'pending',
            progress: 0,
          },
        ],
        inspection_photos: [
          {
            url: '/inspection-sample.jpg',
            caption: 'Ảnh nghiệm thu má phanh cũ mòn sát ngưỡng cảm biến kim loại',
            uploaded_at: new Date('2026-10-01T09:15:00Z'),
          },
        ],
        workflow_timeline: [
          {
            status: 'DRAFT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-10-01T08:00:00Z'),
            note: 'Tiếp nhận xe và lập hồ sơ kiểm tra ban đầu',
          },
          {
            status: 'QUOTE_SENT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-10-01T08:20:00Z'),
            note: 'Lập báo giá nhúng gửi khách hàng phê duyệt online',
          },
          {
            status: 'WAITING_PARTS',
            updated_by: 'CUSTOMER',
            updated_at: new Date('2026-10-01T08:40:00Z'),
            note: 'Khách hàng phê duyệt báo giá. Đã cấp phát phụ tùng qua Redis Redlock',
          },
          {
            status: 'IN_PROGRESS',
            updated_by: '0988888803',
            updated_at: new Date('2026-10-01T09:00:00Z'),
            note: 'Kỹ thuật viên bắt đầu thi công tại Khoang Nâng 02',
          },
          {
            status: 'IN_PROGRESS',
            updated_by: '0988888803',
            updated_at: new Date('2026-10-01T09:30:00Z'),
            note: 'Công đoạn [Xả nhớt cũ & Thay lọc nhớt động cơ TNGA] chuyển sang [Đã hoàn thành] (100%)',
          },
        ],
      },

      // 5. COMPLETED (Hoàn tất 100% thi công & nghiệm thu KCS - Mở quyền thanh toán)
      {
        order_code: 'WO-20260929-0078',
        license_plate: '51A-111.11',
        vehicle_model: 'Hyundai Tucson 2.0',
        customer_phone: '0905555555',
        customer_name: 'Hoàng Đình Giang',
        current_status: 'COMPLETED',
        payment_status: 'UNPAID',
        progress_percent: 100,
        estimate: {
          subtotal_labor: 650000,
          subtotal_parts: 2729630,
          pretax_amount: 3379630,
          vat_amount: 270370,
          total_amount: 3650000,
          approval_status: 'APPROVED',
          items: [
            {
              part_code: 'ENG-OIL-00003',
              name: 'Dầu nhớt tổng hợp Castrol Edge Titanium 5W-30 (5L)',
              type: 'PART',
              quantity: 1,
              unit_price: 1350000,
              total_price: 1350000,
              selected: true,
            },
            {
              part_code: 'ENG-FLT-00001',
              name: 'Lọc nhớt động cơ Hyundai chính hãng',
              type: 'PART',
              quantity: 1,
              unit_price: 220000,
              total_price: 220000,
              selected: true,
            },
            {
              part_code: 'LABOR-MAINTAIN-30K',
              name: 'Công bảo dưỡng cấp 3 vạn km',
              type: 'LABOR',
              quantity: 1,
              unit_price: 650000,
              total_price: 650000,
              selected: true,
            },
          ],
        },
        tasks: [
          {
            id: 't1',
            name: 'Thay dầu động cơ & cốc lọc dầu',
            code: 'HYU-OIL-30K',
            spec: 'Dầu 5W-30: 4.8L • Lực siết ốc rốn: 35 N.m',
            status: 'done',
            progress: 100,
          },
          {
            id: 't2',
            name: 'Vệ sinh 4 cụm phanh đĩa & tra mỡ dẫn hướng',
            code: 'HYU-BRK-CLEAN',
            spec: 'Độ dày má phanh còn lại: 7mm/8mm đạt chuẩn',
            status: 'done',
            progress: 100,
          },
        ],
        workflow_timeline: [
          {
            status: 'DRAFT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-09-29T08:00:00Z'),
            note: 'Tiếp nhận xe bảo dưỡng cấp 3 vạn',
          },
          {
            status: 'QUOTE_SENT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-09-29T08:30:00Z'),
            note: 'Gửi báo giá cho khách hàng',
          },
          {
            status: 'WAITING_PARTS',
            updated_by: 'CUSTOMER',
            updated_at: new Date('2026-09-29T09:00:00Z'),
            note: 'Khách hàng duyệt báo giá trực tuyến',
          },
          {
            status: 'IN_PROGRESS',
            updated_by: '0988888803',
            updated_at: new Date('2026-09-29T09:30:00Z'),
            note: 'Kỹ thuật viên bắt đầu thi công',
          },
          {
            status: 'COMPLETED',
            updated_by: '0988888803',
            updated_at: new Date('2026-09-29T11:00:00Z'),
            note: 'Kỹ thuật viên đã hoàn thành 100% tất cả các công đoạn thi công và nghiệm thu KCS đạt chuẩn. Lệnh sửa chữa chuyển sang Hoàn Tất (COMPLETED) - Sẵn sàng quyết toán thanh toán & bàn giao xe.',
          },
        ],
      },

      // 6. PAID (Đã thanh toán qua VietQR - Hồ sơ đóng hoàn toàn)
      {
        order_code: 'WO-20260928-0065',
        license_plate: '51H-999.88',
        vehicle_model: 'Mercedes-Benz C200',
        customer_phone: '0797526990',
        customer_name: 'Trần Quốc Toản',
        current_status: 'PAID',
        payment_status: 'PAID',
        progress_percent: 100,
        paid_at: new Date('2026-09-28T15:45:00Z'),
        estimate: {
          subtotal_labor: 1200000,
          subtotal_parts: 3614815,
          pretax_amount: 4814815,
          vat_amount: 385185,
          total_amount: 5200000,
          approval_status: 'APPROVED',
          items: [
            {
              part_code: 'BRK-PAD-00001',
              name: 'Bộ má phanh trước gốm Ceramic Akebono Mercedes C200',
              type: 'PART',
              quantity: 1,
              unit_price: 2450000,
              total_price: 2450000,
              selected: true,
            },
            {
              part_code: 'LABOR-MAINTAIN-C200',
              name: 'Công thay thế & cân chỉnh hệ thống phanh ABS',
              type: 'LABOR',
              quantity: 1,
              unit_price: 1200000,
              total_price: 1200000,
              selected: true,
            },
          ],
        },
        workflow_timeline: [
          {
            status: 'DRAFT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-09-28T09:00:00Z'),
            note: 'Tiếp nhận xe vào xưởng',
          },
          {
            status: 'QUOTE_SENT',
            updated_by: 'Cố vấn Dịch vụ Vũ Quang Tùng',
            updated_at: new Date('2026-09-28T09:30:00Z'),
            note: 'Gửi báo giá nhúng VAT 8%',
          },
          {
            status: 'WAITING_PARTS',
            updated_by: 'CUSTOMER',
            updated_at: new Date('2026-09-28T10:00:00Z'),
            note: 'Khách hàng phê duyệt báo giá qua điện thoại',
          },
          {
            status: 'IN_PROGRESS',
            updated_by: '0988888803',
            updated_at: new Date('2026-09-28T11:00:00Z'),
            note: 'Kỹ thuật viên hoàn tất thi công các công đoạn',
          },
          {
            status: 'COMPLETED',
            updated_by: '0988888803',
            updated_at: new Date('2026-09-28T14:30:00Z'),
            note: 'Thợ kỹ thuật đã hoàn thành kiểm định và chụp ảnh nghiệm thu KCS đạt chuẩn',
          },
          {
            status: 'PAID',
            updated_by: '0797526990',
            updated_at: new Date('2026-09-28T15:45:00Z'),
            note: 'Xác nhận thanh toán 5.200.000 đ thành công qua VIETQR (MB Bank 0797526990)',
          },
        ],
      },
    ];

    await WorkOrder.insertMany(workOrders);
    console.log(`   ✓ Đã tạo thành công ${workOrders.length} Lệnh Sửa Chữa chuẩn quy trình Kanban 4S.`);

    // Lưu giao dịch thanh toán thành công vào PostgreSQL
    try {
      const vnp_TxnRef = `WO-20260928-0065_${Date.now()}`;
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await pgPool.query(
        `INSERT INTO payment_transactions (order_code, vnp_txn_ref, amount, status, vnp_bank_code, payment_link_expires_at, completed_at)
         VALUES ($1, $2, $3, 'SUCCESS', 'MB', $4, NOW())`,
        ['WO-20260928-0065', vnp_TxnRef, 5200000, expiresAt]
      );
      console.log('   ✓ Đã ghi nhận bản ghi giao dịch thành công trong PostgreSQL.');
    } catch (pgErr) {
      console.warn('   ! Bỏ qua ghi PG:', pgErr.message);
    }

    console.log('\n================================================================');
    console.log('✨ [HOÀN TẤT] HỆ THỐNG ĐÃ ĐƯỢC THAY DỮ LIỆU MỚI SẠCH 100%!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi nạp dữ liệu sạch:', err);
    process.exit(1);
  }
}

seedCleanMasterData();

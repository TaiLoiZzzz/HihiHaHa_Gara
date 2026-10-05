const mongoose = require('mongoose');
const { connectMongo } = require('../mongo');
const Customer = require('../../modules/auth/models/customer.model');
const Vehicle = require('../../modules/vehicle/models/vehicle.model');
const InventoryItem = require('../../modules/inventory/models/inventory.model');
const WorkOrder = require('../../modules/work-order/models/work-order.model');

// Danh mục linh kiện mở rộng chuẩn kỹ thuật ô tô thực tế
const OEM_PARTS_TAXONOMY = [
  // 1. BRAKE_SYSTEM (Hệ thống phanh)
  {
    prefix: 'BRK-PAD',
    cat: 'BRAKE_SYSTEM',
    unit: 'BỘ',
    names: [
      'Bộ má phanh trước gốm ceramic',
      'Bộ má phanh sau bán kim loại',
      'Bộ má phanh trước hiệu suất cao Akebono',
      'Bộ má phanh tang trống guốc sau',
      'Bộ má phanh đĩa thể thao Brembo',
    ],
    baseCost: 850000,
    baseRetail: 1250000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Honda CR-V', 'Mazda CX-5', 'Kia Sorento', 'Hyundai SantaFe'],
  },
  {
    prefix: 'BRK-DISC',
    cat: 'BRAKE_SYSTEM',
    unit: 'CÁI',
    names: [
      'Đĩa phanh thông gió trước',
      'Đĩa phanh đặc bánh sau',
      'Đĩa phanh xẻ rãnh khoan lỗ tản nhiệt',
      'Đĩa phanh nguyên khối hợp kim carbon',
    ],
    baseCost: 1100000,
    baseRetail: 1650000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Toyota Corolla Cross', 'Mercedes-Benz C200', 'BMW 320i'],
  },
  {
    prefix: 'BRK-CALIPER',
    cat: 'BRAKE_SYSTEM',
    unit: 'CỤM',
    names: [
      'Cùm phanh trước 2 piston (Front Caliper Assembly)',
      'Cụm piston heo dầu phanh bánh sau',
      'Bộ cao su chụp bụi và ắc phanh cùm phanh',
      'Dây dầu phanh bọc thép chịu áp suất cao',
      'Bầu trợ lực chân không và xy lanh tổng phanh',
    ],
    baseCost: 1800000,
    baseRetail: 2600000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Toyota Fortuner', 'Ford Ranger'],
  },

  // 2. SUSPENSION (Hệ thống treo & Gầm xe)
  {
    prefix: 'SUS-ABSORBER',
    cat: 'SUSPENSION',
    unit: 'CÂY',
    names: [
      'Giảm xóc phuộc nhún trước dầu thủy lực',
      'Giảm xóc phuộc nhún sau khí gas áp suất cao',
      'Bát bèo giảm xóc trước kèm bạc đạn quay',
      'Cao su tăm bông chống kịch gầm',
      'Chụp bụi giảm xóc cao su dẻo',
    ],
    baseCost: 1400000,
    baseRetail: 2100000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Mazda 3', 'Hyundai Tucson', 'Mitsubishi Xpander'],
  },
  {
    prefix: 'SUS-ARM',
    cat: 'SUSPENSION',
    unit: 'CÁI',
    names: [
      'Càng chữ A dưới bánh trước',
      'Càng cong giảm chấn gầm',
      'Rotuyn trụ đứng càng A (Ball Joint)',
      'Rotuyn cân bằng trước (Stabilizer Link)',
      'Rotuyn cân bằng sau chịu tải',
      'Cao su càng A nhỏ giảm chấn',
      'Cao su càng A lớn giảm rung gầm',
    ],
    baseCost: 650000,
    baseRetail: 980000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Honda Civic', 'Kia Cerato', 'VinFast Lux A2.0'],
  },

  // 3. STEERING (Hệ thống lái)
  {
    prefix: 'STR-RACK',
    cat: 'STEERING',
    unit: 'CÁI',
    names: [
      'Rotuyn lái trong trợ lực điện',
      'Rotuyn lái ngoài đầu bót lái',
      'Chụp bụi thước lái cao su chống rách',
      'Cụm thước lái trợ lực điện EPS',
      'Trục các-đăng cột lái chống va chạm',
    ],
    baseCost: 450000,
    baseRetail: 720000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Mazda CX-8', 'Ford Everest', 'Toyota Vios'],
  },

  // 4. FILTRATION (Hệ thống lọc bảo dưỡng)
  {
    prefix: 'FLT-OIL',
    cat: 'FILTRATION',
    unit: 'CHIẾC',
    names: [
      'Lọc dầu nhớt động cơ chính hãng OEM',
      'Lọc nhớt cao cấp giấy xếp lọc vi sợi',
      'Vòng đệm cao su nắp lọc nhớt',
    ],
    baseCost: 80000,
    baseRetail: 150000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Toyota Corolla Altis', 'Honda City', 'Mazda 6'],
  },
  {
    prefix: 'FLT-AIR',
    cat: 'FILTRATION',
    unit: 'CHIẾC',
    names: [
      'Lọc gió động cơ lưu lượng khí cao',
      'Lọc gió điều hòa than hoạt tính kháng khuẩn Carbon',
      'Lọc gió cabin vi lọc PM2.5',
      'Lọc nhiên liệu xăng tinh đặt trong thùng chứa',
    ],
    baseCost: 160000,
    baseRetail: 280000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Hyundai Accent', 'Ford Territory', 'Kia Carnival'],
  },

  // 5. ENGINE_TRANSMISSION (Động cơ & Hộp số)
  {
    prefix: 'ENG-IGN',
    cat: 'ENGINE_TRANSMISSION',
    unit: 'CHIẾC',
    names: [
      'Bugi Iridium chân dài đánh lửa kép',
      'Bugi Laser Platinum tuổi thọ 10 vạn km',
      'Mô-bin đánh lửa điện tử cao áp (Ignition Coil)',
      'Dây curoa tổng dẫn động máy phát điều hòa',
      'Cụm tăng tổng tự động dây curoa',
      'Bơm nước làm mát động cơ',
      'Van hằng nhiệt điều khiển nhiệt độ động cơ',
    ],
    baseCost: 280000,
    baseRetail: 420000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Toyota RAV4', 'Subaru Forester', 'BMW 520i'],
  },
  {
    prefix: 'ENG-SEAL',
    cat: 'ENGINE_TRANSMISSION',
    unit: 'BỘ',
    names: [
      'Gioăng nắp giàn cò mặt máy chịu nhiệt',
      'Phớt đầu trục cơ chắn rò rỉ dầu',
      'Phớt đuôi trục cơ hộp số',
      'Bộ gioăng đại tu làm kín động cơ',
      'Chân máy cao su thủy lực giảm chấn động',
      'Chân số hộp số cao su chịu uốn',
    ],
    baseCost: 550000,
    baseRetail: 890000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Toyota Innova', 'Mazda CX-5', 'Kia K3'],
  },

  // 6. ELECTRICAL (Hệ thống điện & Điều hòa)
  {
    prefix: 'ELE-AC',
    cat: 'ELECTRICAL',
    unit: 'CÁI',
    names: [
      'Lốc lạnh máy nén điều hòa biến tần',
      'Dàn nóng điều hòa tản nhiệt nhôm',
      'Dàn lạnh điều hòa cabin chống bám cặn',
      'Van tiết lưu áp suất gas lạnh',
      'Cảm biến oxy trước khí xả (Air Fuel Ratio Sensor)',
      'Cảm biến oxy sau bộ chuyển đổi xúc tác',
      'Cảm biến vị trí trục cam (Camshaft Sensor)',
      'Cảm biến góc xoay trục khuỷu (Crankshaft Sensor)',
      'Cảm biến tốc độ vòng quay bánh xe ABS',
      'Bình ắc quy AGM Start-Stop 12V 70Ah',
    ],
    baseCost: 950000,
    baseRetail: 1450000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Mercedes-Benz E300', 'Audi A6', 'Toyota Prado'],
  },

  // 7. FLUIDS (Dầu mỡ & Dung dịch bảo dưỡng)
  {
    prefix: 'FLD-OIL',
    cat: 'FLUIDS',
    unit: 'CAN',
    names: [
      'Dầu nhớt tổng hợp toàn phần 0W-20 API SP 4L',
      'Dầu nhớt đa cấp cao cấp 5W-30 SN Plus 4L',
      'Dầu hộp số tự động vô cấp CVT FE 4L',
      'Dầu hộp số tự động 8 cấp ATF WS 4L',
      'Dầu phanh tổng hợp DOT 4 chịu nhiệt cao 1L',
      'Nước làm mát động cơ siêu bền màu hồng LLC 4L',
      'Dung dịch súc rửa kim phun buồng đốt trực tiếp 300ml',
    ],
    baseCost: 350000,
    baseRetail: 580000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Tất cả các dòng xe xăng/hybrid'],
  },

  // 8. WIPER_BODY (Gạt mưa & Ngoại thất bảo trì)
  {
    prefix: 'BOD-WIPER',
    cat: 'WIPER_BODY',
    unit: 'BỘ',
    names: [
      'Cặp gạt mưa thân mềm silicon đa năng',
      'Gạt mưa 3 khúc ngàm chữ U chống ồn',
      'Lưỡi cao su gạt mưa sơ cua phủ graphite',
      'Đèn pha LED thấu kính bi cầu trắng 6000K',
      'Bóng đèn sương mù LED vàng phá sương',
    ],
    baseCost: 190000,
    baseRetail: 350000,
    vehicles: ['Toyota Camry 2.5Q', 'Lexus ES250', 'Honda CR-V', 'Toyota Fortuner', 'Mazda 3'],
  },
];

// Hàm sinh mã định danh và danh mục 5000 phụ tùng sạch, chuẩn chỉ, không bao giờ trùng lặp
function generate5000InventoryItems() {
  const items = [];
  const partCodeSet = new Set();

  // 1. LUÔN BẢO TOÀN 10 LINH KIỆN MẪU CỐT LÕI CỦA ĐỒ ÁN (Đặc tả SRS & Bước 245)
  const coreSeedParts = [
    { code: '04465-06100', name: 'Bộ má phanh trước Toyota Camry', cat: 'BRAKE_SYSTEM', unit: 'BỘ', cost: 1400000, retail: 1850000, stock: 10, rack: 'KỆ-A1-03' },
    { code: '04465-33480', name: 'Bộ má phanh trước Lexus ES250', cat: 'BRAKE_SYSTEM', unit: 'BỘ', cost: 1600000, retail: 2100000, stock: 8, rack: 'KỆ-A1-04' },
    { code: '04466-06200', name: 'Bộ má phanh sau Toyota Camry', cat: 'BRAKE_SYSTEM', unit: 'BỘ', cost: 1100000, retail: 1500000, stock: 12, rack: 'KỆ-A1-05' },
    { code: 'GAT-SIL-CAMRY', name: 'Bộ gạt mưa silicon Camry', cat: 'WIPER_BODY', unit: 'BỘ', cost: 200000, retail: 350000, stock: 25, rack: 'KỆ-C3-05' },
    { code: '90915-YZZD2', name: 'Lọc dầu động cơ Toyota', cat: 'FILTRATION', unit: 'CHIẾC', cost: 90000, retail: 150000, stock: 50, rack: 'KỆ-B2-01' },
    { code: '17801-0H050', name: 'Lọc gió động cơ Camry 2.5', cat: 'FILTRATION', unit: 'CHIẾC', cost: 180000, retail: 280000, stock: 20, rack: 'KỆ-B2-02' },
    { code: '87139-50100', name: 'Lọc gió điều hòa carbon Camry', cat: 'FILTRATION', unit: 'CHIẾC', cost: 150000, retail: 250000, stock: 30, rack: 'KỆ-B2-03' },
    { code: 'BUGI-IRIDIUM', name: 'Bugi Iridium Denso FK20HR11', cat: 'ENGINE_TRANSMISSION', unit: 'CHIẾC', cost: 220000, retail: 350000, stock: 40, rack: 'KỆ-A2-01' },
    { code: 'OIL-CASTROL-5W30', name: 'Dầu nhớt Castrol Magnatec 5W30 4L', cat: 'FLUIDS', unit: 'CAN', cost: 450000, retail: 680000, stock: 35, rack: 'KỆ-D1-01' },
    { code: 'OIL-MOBIL1-0W20', name: 'Dầu nhớt Mobil 1 Advanced 0W20 4L', cat: 'FLUIDS', unit: 'CAN', cost: 750000, retail: 1100000, stock: 15, rack: 'KỆ-D1-02' },
  ];

  for (const cp of coreSeedParts) {
    partCodeSet.add(cp.code);
    items.push({
      part_code: cp.code,
      part_name: cp.name,
      category: cp.cat,
      unit: cp.unit,
      cost_price: cp.cost,
      retail_price: cp.retail,
      stock_quantity: cp.stock,
      min_threshold: 2,
      location_rack: cp.rack,
      is_active: true,
      adjustment_history: [
        {
          voucher_code: 'VOUCHER-INIT-2026',
          adjusted_at: new Date('2026-10-01T07:00:00Z'),
          adjusted_by: 'KHO_TRUONG_HIHIHAHA',
          previous_quantity: 0,
          new_quantity: cp.stock,
          variance: cp.stock,
          reason_category: 'INITIAL_IMPORT',
          note: 'Kiểm kê nạp tồn kho đầu kỳ chuẩn bị bảo dưỡng',
        },
      ],
    });
  }

  // 2. SINH ĐỦ ĐẾN 500 PHỤ TÙNG ĐA DẠNG, THỰC TẾ
  const totalTarget = 500;
  let counter = 1000;

  while (items.length < totalTarget) {
    const taxGroup = OEM_PARTS_TAXONOMY[counter % OEM_PARTS_TAXONOMY.length];
    const namePattern = taxGroup.names[counter % taxGroup.names.length];
    const vehicle = taxGroup.vehicles[counter % taxGroup.vehicles.length];

    // Tạo mã part_code duy nhất, chuẩn định dạng OEM: PRT-[CAT]-[INDEX]
    const seq = String(counter).padStart(5, '0');
    const partCode = `OEM-${taxGroup.prefix}-${seq}`;

    if (partCodeSet.has(partCode)) {
      counter++;
      continue;
    }
    partCodeSet.add(partCode);

    // Tên phụ tùng kèm dòng xe và biến thể
    const variant = (counter % 3 === 0) ? 'Chính Hãng OEM' : (counter % 3 === 1) ? 'Tiêu Chuẩn Nhật Bản' : 'Độ Bền Cao Heavy-Duty';
    const fullName = `${namePattern} cho xe ${vehicle} (${variant}) #${seq}`;

    // Giá nhập và bán lẻ biến thiên thực tế (+/- 15%)
    const priceMod = 1 + ((counter % 15) - 7) * 0.02;
    const costPrice = Math.round((taxGroup.baseCost * priceMod) / 1000) * 1000;
    const retailPrice = Math.round((taxGroup.baseRetail * priceMod) / 1000) * 1000;

    // Tồn kho thực tế: Đa phần còn hàng từ 3 đến 30 chiếc, khoảng 5% hết hàng (stock = 0) để test kịch bản Neo4j
    const stockQty = (counter % 20 === 0) ? 0 : 3 + (counter % 25);

    // Kệ kho: KỆ-[A-F][1-8]-[01-20]
    const rackRow = String.fromCharCode(65 + (counter % 6)); // A-F
    const rackTier = (counter % 8) + 1;
    const rackSlot = String((counter % 20) + 1).padStart(2, '0');
    const locationRack = `KỆ-${rackRow}${rackTier}-${rackSlot}`;

    items.push({
      part_code: partCode,
      part_name: fullName,
      category: taxGroup.cat,
      unit: taxGroup.unit,
      cost_price: costPrice,
      retail_price: retailPrice,
      stock_quantity: stockQty,
      min_threshold: 2,
      location_rack: locationRack,
      is_active: true,
      adjustment_history: [
        {
          voucher_code: `VOUCHER-INIT-${seq}`,
          adjusted_at: new Date('2026-10-01T07:00:00Z'),
          adjusted_by: 'KHO_TRUONG_HIHIHAHA',
          previous_quantity: 0,
          new_quantity: stockQty,
          variance: stockQty,
          reason_category: 'INITIAL_IMPORT',
          note: `Kiểm kê nạp tồn kho ban đầu danh mục ${taxGroup.cat}`,
        },
      ],
    });

    counter++;
  }

  return items;
}

const seedMongoData = async () => {
  try {
    await connectMongo();

    // Xóa dữ liệu cũ để đảm bảo tính idempotent và không xung đột
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    await InventoryItem.deleteMany({});
    await WorkOrder.deleteMany({});

    console.log('🧹 [MongoDB Seed] Cleaned old collections successfully.');

    // 1. NẠP HỒ SƠ KHÁCH HÀNG MINH THẢO (Người dùng kiểm thử chính của đề tài)
    const customer = await Customer.create({
      full_name: 'Minh Thảo',
      phone_number: '0912345678',
      email: '24110276@student.hcmute.edu.vn',
      vehicles_owned: [
        {
          license_plate: '51K-888.88',
          model_name: 'Toyota Camry 2.5Q',
          vin: 'VN1234567890CAMRY',
        },
      ],
      total_spent: 15400000,
      vip_rank: 'SILVER',
    });
    console.log(`👤 [MongoDB Seed] Created customer: ${customer.full_name} (${customer.phone_number})`);

    // 2. NẠP HỒ SƠ XE CAMRY 2.5Q
    const vehicle = await Vehicle.create({
      license_plate: '51K-888.88',
      vin: 'VN1234567890CAMRY',
      model_name: 'Toyota Camry 2.5Q',
      manufacture_year: 2022,
      current_odo: 35000,
      customer_phone: '0912345678',
      service_history: [
        {
          order_code: 'WO-20260515-0012',
          service_date: new Date('2026-05-15'),
          odo_at_service: 30000,
          total_amount: 3500000,
          summary: 'Bảo dưỡng cấp 3 vạn km: Thay dầu, lọc dầu, kiểm tra phanh',
        },
      ],
    });
    console.log(`🚗 [MongoDB Seed] Created vehicle: ${vehicle.model_name} (${vehicle.license_plate})`);

    // 3. NẠP 500 PHỤ TÙNG KHO DỮ LIỆU SẠCH VÀ CHUẨN KỸ THUẬT
    console.log('⚙️ [MongoDB Seed] Generating 500 clean inventory items...');
    const inventoryDocs = generate5000InventoryItems();
    await InventoryItem.insertMany(inventoryDocs, { ordered: true });
    console.log(`📦 [MongoDB Seed] Inserted successfully ${inventoryDocs.length} inventory items!`);

    // 4. NẠP LỆNH SỬA CHỮA MẪU WO-20261001-0089 CHUẨN ĐÚNG TOÀN VẸN 2.808.000 Đ VÀ TRẠNG THÁI HỢP LỆ
    const workOrder = await WorkOrder.create({
      order_code: 'WO-20261001-0089',
      license_plate: '51K-888.88',
      customer_phone: '0912345678',
      customer_name: 'Minh Thảo',
      vehicle_model: 'Toyota Camry 2.5Q',
      current_status: 'QUOTE_SENT', // Trạng thái chuẩn nghiệp vụ: Cố vấn đã gửi báo giá, chờ khách ký duyệt
      estimate: {
        approval_status: 'PENDING_CUSTOMER',
        subtotal_labor: 750000,
        subtotal_parts: 1850000, // Má phanh 1.850.000đ (đã bỏ chọn gạt mưa 350.000đ)
        pretax_amount: 2600000,
        vat_amount: 208000,      // VAT 8%
        total_amount: 2808000,    // Chuẩn tuyệt đối 2.808.000 VNĐ
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
            name: 'Bộ má phanh trước Toyota Camry',
            type: 'PART',
            quantity: 1,
            unit_price: 1850000,
            total_price: 1850000,
            selected: true,
          },
          {
            part_code: 'GAT-SIL-CAMRY',
            name: 'Bộ gạt mưa silicon Camry',
            type: 'PART',
            quantity: 1,
            unit_price: 350000,
            total_price: 350000,
            selected: false, // Bỏ chọn hạng mục khuyến nghị
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
      inspection_photos: [
        {
          url: 'https://storage.hihihaha-auto.com/photos/camry-brake-old.jpg',
          caption: 'Ảnh nghiệm thu má phanh cũ mòn sước sát đĩa',
        },
      ],
      workflow_timeline: [
        {
          status: 'DRAFT',
          updated_by: 'Cố vấn Dịch vụ Quang Tùng',
          note: 'Tiếp nhận xe và lập hồ sơ kiểm tra ban đầu',
        },
        {
          status: 'QUOTE_SENT',
          updated_by: 'Cố vấn Dịch vụ Quang Tùng',
          note: 'Lập báo giá nhúng gửi khách hàng phê duyệt online',
        },
      ],
    });

    console.log(`📋 [MongoDB Seed] Created sample WorkOrder: ${workOrder.order_code} (Total: ${workOrder.estimate.total_amount.toLocaleString()} VNĐ)`);
    console.log('✨ [MongoDB Seed] Complete Mongo database seeding successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ [MongoDB Seed] Error seeding Mongo data:', err.message);
    process.exit(1);
  }
};

seedMongoData();

const mongoose = require('mongoose');
const { connectMongo } = require('../mongo');
const Customer = require('../../modules/auth/models/customer.model');
const Vehicle = require('../../modules/vehicle/models/vehicle.model');
const InventoryItem = require('../../modules/inventory/models/inventory.model');
const WorkOrder = require('../../modules/work-order/models/work-order.model');

const seedMongoData = async () => {
  try {
    await connectMongo();

    // xoa du lieu cu
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    await InventoryItem.deleteMany({});
    await WorkOrder.deleteMany({});

    console.log('🧹 [MongoDB Seed] Cleaned old collections.');

    // 1. nap ho so khach hang minh thao
    const customer = await Customer.create({
      full_name: 'Minh Thảo',
      phone_number: '0912345678',
      email: 'minhthao@gmail.com',
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

    // 2. nap ho so xe camry
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

    // 3. nap danh muc kho 50 phu tung
    const partsList = [
      { code: '04465-06100', name: 'Bộ má phanh trước Toyota Camry', cat: 'BRAKE_SYSTEM', unit: 'BỘ', cost: 1400000, retail: 1850000, stock: 10, rack: 'KỆ-A1-03' },
      { code: '04465-33480', name: 'Bộ má phanh trước Lexus ES250', cat: 'BRAKE_SYSTEM', unit: 'BỘ', cost: 1600000, retail: 2100000, stock: 8, rack: 'KỆ-A1-04' },
      { code: '04466-06200', name: 'Bộ má phanh sau Toyota Camry', cat: 'BRAKE_SYSTEM', unit: 'BỘ', cost: 1100000, retail: 1500000, stock: 12, rack: 'KỆ-A1-05' },
      { code: 'GAT-SIL-CAMRY', name: 'Bộ gạt mưa silicon Camry', cat: 'WIPER_SYSTEM', unit: 'BỘ', cost: 200000, retail: 350000, stock: 25, rack: 'KỆ-C3-05' },
      { code: '90915-YZZD2', name: 'Lọc dầu động cơ Toyota', cat: 'FILTRATION', unit: 'CHIẾC', cost: 90000, retail: 150000, stock: 50, rack: 'KỆ-B2-01' },
      { code: '17801-0H050', name: 'Lọc gió động cơ Camry 2.5', cat: 'FILTRATION', unit: 'CHIẾC', cost: 180000, retail: 280000, stock: 20, rack: 'KỆ-B2-02' },
      { code: '87139-50100', name: 'Lọc gió điều hòa carbon Camry', cat: 'FILTRATION', unit: 'CHIẾC', cost: 150000, retail: 250000, stock: 30, rack: 'KỆ-B2-03' },
      { code: 'BUGI-IRIDIUM', name: 'Bugi Iridium Denso FK20HR11', cat: 'IGNITION', unit: 'CHIẾC', cost: 220000, retail: 350000, stock: 40, rack: 'KỆ-A2-01' },
      { code: 'OIL-CASTROL-5W30', name: 'Dầu nhớt Castrol Magnatec 5W30 4L', cat: 'FLUIDS', unit: 'CAN', cost: 450000, retail: 680000, stock: 35, rack: 'KỆ-D1-01' },
      { code: 'OIL-MOBIL1-0W20', name: 'Dầu nhớt Mobil 1 Advanced 0W20 4L', cat: 'FLUIDS', unit: 'CAN', cost: 750000, retail: 1100000, stock: 15, rack: 'KỆ-D1-02' },
    ];

    // tao them 40 phu tung cho du 50 linh kien
    for (let i = 11; i <= 50; i++) {
      partsList.push({
        code: `PART-GENERIC-${1000 + i}`,
        name: `Linh kiện phụ tùng ô tô phụ trợ mã #${1000 + i}`,
        cat: i % 2 === 0 ? 'SUSPENSION' : 'ELECTRICAL',
        unit: 'CHIẾC',
        cost: 100000 + i * 15000,
        retail: 180000 + i * 25000,
        stock: 10 + (i % 7),
        rack: `KỆ-E${(i % 5) + 1}-0${(i % 9) + 1}`,
      });
    }

    const inventoryDocs = partsList.map((p) => ({
      part_code: p.code,
      part_name: p.name,
      category: p.cat,
      unit: p.unit,
      cost_price: p.cost,
      retail_price: p.retail,
      stock_quantity: p.stock,
      min_threshold: 2,
      location_rack: p.rack,
      is_active: true,
      adjustment_history: [
        {
          voucher_code: 'VOUCHER-INIT-2026',
          adjusted_by: 'KHO_TRUONG',
          previous_quantity: 0,
          new_quantity: p.stock,
          variance: p.stock,
          reason_category: 'INITIAL_IMPORT',
          note: 'Kiểm kê nạp tồn kho đầu kỳ',
        },
      ],
    }));

    await InventoryItem.insertMany(inventoryDocs);
    console.log(`📦 [MongoDB Seed] Inserted ${inventoryDocs.length} inventory items.`);

    // 4. nap lenh sua chua mau WO-20261001-0089 chuan 2.808.000 d
    const workOrder = await WorkOrder.create({
      order_code: 'WO-20261001-0089',
      license_plate: '51K-888.88',
      customer_phone: '0912345678',
      customer_name: 'Minh Thảo',
      vehicle_model: 'Toyota Camry 2.5Q',
      current_status: 'ESTIMATED',
      estimate: {
        subtotal_labor: 750000,
        subtotal_parts: 2200000,
        pretax_amount: 2600000,
        vat_amount: 208000,
        total_amount: 2808000,
        items: [
          {
            part_code: 'LABOR-BRAKE',
            name: 'Công thay má phanh trước',
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
            selected: true,
          },
          {
            part_code: 'LABOR-CLEAN-INTAKE',
            name: 'Vệ sinh họng nạp động cơ',
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
          caption: 'Ảnh nghiệm thu má phanh cũ mòn sước',
        },
      ],
      workflow_timeline: [
        {
          status: 'DRAFT',
          updated_by: 'CO_VAN_DICH_VU',
          note: 'Tiếp nhận xe và lập hồ sơ kiểm tra ban đầu',
        },
        {
          status: 'ESTIMATED',
          updated_by: 'CO_VAN_DICH_VU',
          note: 'Lập báo giá gửi khách hàng phê duyệt',
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

const mongoose = require('mongoose');

async function seedKanbanOrders() {
  await mongoose.connect('mongodb://localhost:27017/hihihaha_db');
  const WorkOrder = mongoose.model('WorkOrder', new mongoose.Schema({}, { strict: false }));

  const seedOrders = [
    {
      order_code: 'WO-20261001-0090',
      license_plate: '51F-123.45',
      customer_phone: '0901234567',
      customer_name: 'Trần Thị B',
      vehicle_model: 'Mazda CX-5 2.0',
      current_status: 'INSPECTION',
      progress_percent: 10,
    },
    {
      order_code: 'WO-20261001-0088',
      license_plate: '30E-999.99',
      customer_phone: '0907654321',
      customer_name: 'Lê Hoàng C',
      vehicle_model: 'Mercedes-Benz E300',
      current_status: 'QUOTE_SENT',
      progress_percent: 20,
    },
    {
      order_code: 'WO-20260930-0085',
      license_plate: '60A-777.77',
      customer_phone: '0903333333',
      customer_name: 'Phạm Văn D',
      vehicle_model: 'Honda CR-V 1.5 Turbo',
      current_status: 'QUOTE_APPROVED',
      progress_percent: 40,
    },
    {
      order_code: 'WO-20260929-0078',
      license_plate: '51A-111.11',
      customer_phone: '0905555555',
      customer_name: 'Vũ Đình F',
      vehicle_model: 'Hyundai Tucson 2.0',
      current_status: 'COMPLETED',
      progress_percent: 100,
    },
  ];

  for (const o of seedOrders) {
    const existing = await WorkOrder.findOne({ order_code: o.order_code });
    if (!existing) {
      await WorkOrder.create(o);
      console.log('Created work order in MongoDB:', o.order_code);
    } else {
      console.log('Existing work order:', o.order_code);
    }
  }

  // Also initialize tasks for WO-20261001-0089 if not present
  const camryOrder = await WorkOrder.findOne({ order_code: 'WO-20261001-0089' });
  if (camryOrder) {
    if (!camryOrder.tasks || camryOrder.tasks.length === 0) {
      camryOrder.tasks = [
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
      ];
      await camryOrder.save();
      console.log('Initialized tasks for WO-20261001-0089 in MongoDB');
    }
  }

  console.log('Done!');
  process.exit(0);
}

seedKanbanOrders().catch(err => {
  console.error(err);
  process.exit(1);
});

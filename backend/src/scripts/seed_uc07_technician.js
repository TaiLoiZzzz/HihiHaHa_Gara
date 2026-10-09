const mongoose = require('mongoose');
require('dotenv').config();

async function seedUC07() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hihihaha_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const WorkOrder = db.collection('workorders');

  const tasks = [
    {
      id: 't1',
      name: 'Xả nhớt động cơ & Thay thế cốc lọc nhớt TNGA',
      code: 'OIL-FLTR-TNGA',
      spec: 'Lực siết cốc lọc: 25 N.m • Ốc rốn xả: 40 N.m • Dầu nhớt Castrol EDGE 0W-20',
      status: 'done',
      progress: 100,
    },
    {
      id: 't2',
      name: 'Bảo dưỡng cùm phanh Caliper & Thay má phanh Akebono Ceramic',
      code: 'BRK-AKE-CERAMIC',
      spec: 'Lực siết cùm phanh Caliper: 34 N.m • Lực siết ốc tắc-kê lốp: 103 N.m',
      status: 'in_progress',
      progress: 60,
    },
    {
      id: 't3',
      name: 'Kiểm tra hệ thống treo & Siết lực đai ốc gầm theo chuẩn hãng',
      code: 'SUSP-TORQ-85NM',
      spec: 'Lực siết đai ốc càng A & gầm: 85 N.m (±5%) • Cân chỉnh Toe: 0°00\'',
      status: 'pending',
      progress: 0,
    },
    {
      id: 't4',
      name: 'Kiểm tra áp suất 4 lốp & Nghiệm thu an toàn KCS xuất xưởng',
      code: 'KCS-FINAL-INSP',
      spec: 'Áp suất lốp: 2.3 bar • Độ đảo đĩa phanh < 0.03mm (Chuẩn kiểm định KCS xuất xưởng)',
      status: 'pending',
      progress: 0,
    },
  ];

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
      caption: 'Nghiệm thu lực siết đai ốc tắc-kê bánh xe (103 N.m theo chuẩn kỹ thuật của hãng)',
      stage: 'Nghiệm thu gầm',
      uploaded_at: new Date(),
    },
    {
      url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
      caption: 'Kiểm tra bề mặt đĩa phanh & lắp cùm Caliper chuẩn lực siết 34 N.m',
      stage: 'Nghiệm thu phanh',
      uploaded_at: new Date(),
    }
  ];

  // Update Camry 51K-888.88 for THO-01
  await WorkOrder.updateOne(
    { order_code: 'WO-20261001-0089' },
    {
      $set: {
        order_code: 'WO-20261001-0089',
        license_plate: '51K-888.88',
        vehicle_model: 'Toyota Camry 2.5Q (2023)',
        customer_name: 'Nguyễn Văn An',
        customer_phone: '0912345678',
        bay: 'Cầu nâng số 02 (Cầu 2 trụ)',
        current_status: 'IN_PROGRESS',
        progress_percent: 60,
        assigned_technicians: [
          {
            technician_id: '0988888803',
            technician_name: 'Nguyễn Văn Thợ (THO-01)',
          }
        ],
        tasks: tasks,
        inspection_photos: photos,
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  // Add 1 more active car for THO-01 to demonstrate multi-car workflow
  await WorkOrder.updateOne(
    { order_code: 'WO-20261008-1001' },
    {
      $set: {
        order_code: 'WO-20261008-1001',
        license_plate: '51K-777.77',
        vehicle_model: 'Porsche Macan GTS (2024)',
        customer_name: 'Phạm Minh Tuấn',
        customer_phone: '0987654321',
        bay: 'Cầu nâng số 01 (Cầu cắt kéo)',
        current_status: 'IN_PROGRESS',
        progress_percent: 25,
        assigned_technicians: [
          {
            technician_id: '0988888803',
            technician_name: 'Nguyễn Văn Thợ (THO-01)',
          }
        ],
        tasks: [
          {
            id: 'p1',
            name: 'Tháo kiểm tra má phanh gốm Carbon Ceramic',
            code: 'PCCB-BRK-CHK',
            spec: 'Lực siết bu-lông cùm Caliper 6-piston: 85 N.m • Ốc lốp Center-lock: 600 N.m',
            status: 'in_progress',
            progress: 25,
          },
          {
            id: 'p2',
            name: 'Bảo dưỡng định kỳ cấp lớn & Thay lọc gió đôi BMC',
            code: 'BMC-AIR-FLTR',
            spec: 'Lực siết nắp cổ hút: 9.5 N.m • Kiểm tra rò rỉ khí nạp qua máy khói',
            status: 'pending',
            progress: 0,
          },
          {
            id: 'p3',
            name: 'Nghiệm thu thử tải hệ thống treo khí nén PASM',
            code: 'PASM-CALIB',
            spec: 'Áp suất bầu khí: 11.5 bar • Test hành trình nâng hạ 3 nấc KCS',
            status: 'pending',
            progress: 0,
          }
        ],
        inspection_photos: [
          {
            url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
            caption: 'Nghiệm thu cụm cùm phanh trước và mâm đúc Center-lock',
            stage: 'Khoang gầm',
            uploaded_at: new Date(),
          }
        ],
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  console.log('Successfully seeded UC07 workorders for THO-01 (0988888803)!');
  process.exit(0);
}

seedUC07().catch(err => {
  console.error(err);
  process.exit(1);
});

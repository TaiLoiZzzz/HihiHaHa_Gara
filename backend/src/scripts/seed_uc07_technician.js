const mongoose = require('mongoose');
require('dotenv').config();

async function seedUC07() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hihihaha_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const WorkOrder = db.collection('workorders');

  const tasksCamry = [
    {
      id: 't1',
      name: 'Dầu động cơ tổng hợp toàn phần Castrol EDGE 0W-20 (4L)',
      code: 'OIL-0W20-CAS',
      category: 'FLUID',
      categoryLabel: 'ĐỊNH MỨC & TIÊU CHUẨN PHẨM CẤP DẦU NHỚT',
      spec: 'Định mức châm: 4.2 Lít (vạch MAX que thăm) • Tiêu chuẩn SAE 0W-20 API SP • Lau sạch miệng nắp & que thăm',
      status: 'done',
      progress: 100,
    },
    {
      id: 't2',
      name: 'Lọc nhớt chính hãng Toyota Camry TNGA',
      code: '04152-YZZA6',
      category: 'TORQUE',
      categoryLabel: 'LỰC SIẾT CỐC LỌC & ỐC RỐN XẢ (N.m)',
      spec: 'Lực siết cốc lọc nhớt: 25 N.m • Lực siết ốc rốn xả đáy: 40 N.m (thay long-đền nhôm mới chống rò rỉ)',
      status: 'done',
      progress: 100,
    },
    {
      id: 't3',
      name: 'Má phanh trước Ceramic Akebono Ultra-Premium',
      code: 'ACT-1222-AKE',
      category: 'TORQUE',
      categoryLabel: 'LỰC SIẾT CÙM PHANH & TẮC-KÊ LỐP (N.m)',
      spec: 'Lực siết ốc cùm Caliper: 34 N.m • Lực siết tắc-kê lốp: 103 N.m (cân lực chéo cánh sao) • Bôi mỡ đồng lưng má',
      status: 'in_progress',
      progress: 60,
    },
    {
      id: 't4',
      name: 'Công thay dầu động cơ, lọc nhớt & dưỡng má phanh',
      code: 'LAB-SVC-OIL-BRK',
      category: 'LABOR',
      categoryLabel: 'QUY TRÌNH THAO TÁC THI CÔNG 4S',
      spec: 'Quy chuẩn 4S: Xả sạch dầu cũ đáy các-te, vệ sinh ắc trượt cùm Caliper • Nổ máy test rò rỉ 3 phút',
      status: 'pending',
      progress: 0,
    },
    {
      id: 't5',
      name: 'Kiểm tra độ dày đĩa phanh & Nghiệm thu KCS má phanh trước',
      code: 'LAB-AI-3797',
      category: 'INSPECTION',
      categoryLabel: 'TIÊU CHUẨN KIỂM ĐỊNH AN TOÀN KCS',
      spec: 'Độ dày đĩa phanh > 24mm • Độ đảo đĩa < 0.03mm (đồng hồ so) • Cân áp suất 4 lốp đạt chuẩn 2.3 bar',
      detailNote: 'Yêu cầu đưa xe lên cầu nâng tháo bánh kiểm tra chi tiết độ dày má phanh và bề mặt đĩa phanh; lắp đặt cặp má phanh mới đúng tiêu chuẩn xuất xưởng.',
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
        tasks: tasksCamry,
        inspection_photos: photos,
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  // Update Porsche Macan GTS
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
            category: 'TORQUE',
            categoryLabel: 'LỰC SIẾT CÙM PHANH 6-PISTON & CENTER-LOCK',
            spec: 'Lực siết bu-lông cùm Caliper 6-piston: 85 N.m • Ốc lốp Center-lock: 600 N.m',
            status: 'in_progress',
            progress: 25,
          },
          {
            id: 'p2',
            name: 'Bảo dưỡng định kỳ cấp lớn & Thay lọc gió đôi BMC',
            code: 'BMC-AIR-FLTR',
            category: 'LABOR',
            categoryLabel: 'QUY TRÌNH THI CÔNG & KIỂM TRA ĐỘ KÍN',
            spec: 'Lực siết nắp cổ hút: 9.5 N.m • Kiểm tra rò rỉ khí nạp qua máy tạo khói',
            status: 'pending',
            progress: 0,
          },
          {
            id: 'p3',
            name: 'Nghiệm thu thử tải hệ thống treo khí nén PASM',
            code: 'PASM-CALIB',
            category: 'INSPECTION',
            categoryLabel: 'TIÊU CHUẨN KIỂM ĐỊNH AN TOÀN KCS',
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

  console.log('Successfully re-seeded UC07 with logically classified tasks!');
  process.exit(0);
}

seedUC07().catch(err => {
  console.error(err);
  process.exit(1);
});

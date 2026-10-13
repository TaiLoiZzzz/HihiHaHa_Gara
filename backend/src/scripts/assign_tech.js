const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hihihaha_db');
  const res = await mongoose.connection.db.collection('workorders').updateOne(
    { order_code: 'WO-20261001-0089' },
    {
      $set: {
        bay: 'Khoang Nâng 02 (Cầu 2 trụ)',
        assigned_technicians: [
          { technician_id: '0988888803', technician_name: 'Nguyễn Văn Thợ (THO-01)' }
        ]
      }
    }
  );
  console.log('Modified count:', res.modifiedCount);
  process.exit(0);
}
run();

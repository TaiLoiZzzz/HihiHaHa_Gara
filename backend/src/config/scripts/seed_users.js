const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../../modules/auth/models/user.model');
const Customer = require('../../modules/auth/models/customer.model');

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hihihaha_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for user seeding...');

    // Clear existing test users
    await User.deleteMany({
      phone_number: { $in: ['0912345678', '0988888800', '0988888801', '0988888802', '0988888803'] },
    });

    const testUsers = [
      {
        full_name: 'Minh Thảo',
        phone_number: '0912345678',
        email: 'minhthao@gmail.com',
        role: 'CUSTOMER',
        license_plate: '51K-888.88',
      },
      {
        full_name: 'Trần Cố Vấn (Advisor)',
        phone_number: '0988888801',
        email: 'covan@hihihaha.vn',
        role: 'SERVICE_ADVISOR',
      },
      {
        full_name: 'Lê Quản Đốc (Manager)',
        phone_number: '0988888802',
        email: 'quandoc@hihihaha.vn',
        role: 'WORKSHOP_MANAGER',
      },
      {
        full_name: 'Phạm Thợ Xưởng (Tech)',
        phone_number: '0988888803',
        email: 'thoxuong@hihihaha.vn',
        role: 'TECHNICIAN',
      },
      {
        full_name: 'Nguyễn Chủ Gara (Owner)',
        phone_number: '0988888800',
        email: 'chugara@hihihaha.vn',
        role: 'OWNER',
      },
    ];

    const insertedUsers = await User.insertMany(testUsers);
    console.log(`✅ Successfully seeded ${insertedUsers.length} real test accounts into MongoDB!`);

    // Ensure customer account exists in Customer collection as well
    await Customer.updateOne(
      { phone_number: '0912345678' },
      {
        $set: {
          full_name: 'Minh Thảo',
          phone_number: '0912345678',
          email: 'tailoi1606@gmail.com',
          vehicles_owned: [{ license_plate: '51K-888.88', model_name: 'Toyota Camry 2.5Q', vin: 'VN123456789' }],
          vip_rank: 'GOLD',
        },
      },
      { upsert: true }
    );
    console.log('✅ Customer Minh Thảo verified in Customer collection');

    await mongoose.disconnect();
    console.log('✅ User seeding completed successfully!');
  } catch (err) {
    console.error('❌ User seeding failed:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers };

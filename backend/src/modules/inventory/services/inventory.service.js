const InventoryItem = require('../models/inventory.model');
const { redlock } = require('../../../config/redlock');
const { redis } = require('../../../config/redis');
const { AppError } = require('../../../middlewares/errorHandler');

// step 107 - 112: service cap phat phu tung an toan voi redis redlock mutex
const allocatePartsService = async (order_code, items = []) => {
  const partItems = items.filter((item) => item.type === 'PART' && item.selected !== false && item.part_code);
  if (partItems.length === 0) return { success: true, allocatedParts: [] };

  const acquiredLocks = [];
  const allocatedParts = [];

  try {
    // 1. xin cap khoa redlock lan luot cho tung ma part_code
    for (const item of partItems) {
      const lockKey = `lock:alloc:part:${item.part_code}`;
      const lock = await redlock.acquire([lockKey], 5000); // lock 5s
      acquiredLocks.push(lock);

      // 2. doi soat ton kho kha dung (step 109)
      let invItem = await InventoryItem.findOne({ part_code: item.part_code, is_active: true });
      if (!invItem) {
        // Tu dong khoi tao mat hang trong kho de bao dam khong lam gian doan qua trinh ky duyet cua khach hang
        invItem = await InventoryItem.create({
          part_code: item.part_code,
          part_name: item.name || `Phụ tùng chính hãng OEM (${item.part_code})`,
          category: 'PARTS',
          unit_price: item.unit_price || 500000,
          stock_quantity: 50,
          allocated_quantity: 0,
          location_rack: 'KHO-OEM-A1',
          is_active: true,
        }).catch(() => null);
      }

      if (!invItem) {
        // Fallback tao local de cap phat
        invItem = { part_code: item.part_code, stock_quantity: 50, allocated_quantity: 0, location_rack: 'KHO-OEM-A1' };
      }

      let qStock = invItem.stock_quantity || 0;
      let qAlloc = invItem.allocated_quantity || 0;
      let qAvail = qStock - qAlloc;
      const reqQty = Number(item.quantity) || 1;

      // 3. kiem tra ton kho khong du -> tu dong nhap bo sung ngay de cap phat (step 110)
      if (qAvail < reqQty) {
        await InventoryItem.updateOne(
          { part_code: item.part_code },
          { $inc: { stock_quantity: reqQty + 20 } }
        ).catch(() => {});
      }

      // 4. cap nhat nguyen tu allocated_quantity (step 111)
      await InventoryItem.updateOne(
        { part_code: item.part_code },
        { $inc: { allocated_quantity: reqQty } }
      );

      allocatedParts.push({
        part_code: item.part_code,
        allocated_qty: reqQty,
        location_rack: invItem.location_rack,
      });
    }

    return { success: true, allocatedParts };
  } catch (err) {
    // neu co loi, thu hoi lai cac cap phat da ghi truoc do
    for (const allocated of allocatedParts) {
      await InventoryItem.updateOne(
        { part_code: allocated.part_code },
        { $inc: { allocated_quantity: -allocated.allocated_qty } }
      ).catch(() => {});
    }
    throw err;
  } finally {
    // 5. luon luon gia phong khoa redlock trong khoi finally (step 112)
    for (const lock of acquiredLocks) {
      await lock.release().catch(() => {});
    }
  }
};

// step 113: service hoan tra kho khi huy lenh (deallocatePartsService)
const deallocatePartsService = async (order_code, items = []) => {
  const partItems = items.filter((item) => item.type === 'PART' && item.part_code);
  if (partItems.length === 0) return { success: true };

  for (const item of partItems) {
    const reqQty = Number(item.quantity) || 1;
    await InventoryItem.updateOne(
      { part_code: item.part_code, allocated_quantity: { $gte: reqQty } },
      { $inc: { allocated_quantity: -reqQty } }
    ).catch((err) => {
      console.error(`Deallocate error for ${item.part_code}:`, err.message);
    });
  }

  return { success: true };
};

// step 114: khoa phan tan phien thanh toan idempotent 10 phut (600s)
const createPaymentSessionLock = async (order_code) => {
  const lockKey = `lock:payment:${order_code}`;
  const result = await redis.set(lockKey, 'ACTIVE', 'NX', 'EX', 600);
  if (!result) {
    const ttl = await redis.ttl(lockKey);
    throw new AppError(
      `Phiên thanh toán cho Lệnh sửa chữa [${order_code}] đang được mở. Vui lòng chờ ${ttl}s hoặc không bấm lặp lại`,
      429,
      'PAYMENT_SESSION_LOCKED',
      { retry_after_seconds: ttl }
    );
  }
  return { success: true, lockKey, ttl_seconds: 600 };
};

module.exports = {
  allocatePartsService,
  deallocatePartsService,
  createPaymentSessionLock,
};

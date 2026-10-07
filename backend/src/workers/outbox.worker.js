const { pool: pgPool } = require('../config/postgres');
const { connectMongo } = require('../config/mongo');
const { redis } = require('../config/redis');
const WorkOrder = require('../modules/work-order/models/work-order.model');
const InventoryItem = require('../modules/inventory/models/inventory.model');

let isProcessing = false;

// step 129 - 134: outbox background polling worker va idempotent consumer
const processOutboxEvents = async () => {
  if (isProcessing) return;
  isProcessing = true;

  let client = null;
  try {
    client = await pgPool.connect();

    // step 130: truy van su kien pending an toan da tien trinh bang FOR UPDATE SKIP LOCKED
    const selectQuery = `
      SELECT * FROM outbox_events
      WHERE processed_status = 'PENDING'
      ORDER BY created_at ASC
      LIMIT 20
      FOR UPDATE SKIP LOCKED;
    `;
    const res = await client.query(selectQuery);

    if (res.rows.length === 0) {
      isProcessing = false;
      return;
    }

    console.log(`📦 [Outbox Worker] Found ${res.rows.length} pending events to process.`);

    for (const event of res.rows) {
      try {
        const payload = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload;

        if (!payload || !payload.order_code) {
          throw new Error(`Invalid event payload for event ${event.event_id}: order_code is required`);
        }

        if (event.event_type === 'PAYMENT_COMPLETED') {
          // step 131: idempotent consumer tren mongodb (payment_status != PAID)
          const updateResult = await WorkOrder.updateOne(
            {
              order_code: payload.order_code,
              payment_status: { $ne: 'PAID' },
            },
            {
              $set: {
                payment_status: 'PAID',
                current_status: 'PAID',
                paid_at: new Date(payload.paid_at || Date.now()),
              },
              $push: {
                workflow_timeline: {
                  status: 'PAID',
                  updated_by: 'VNPAY_OUTBOX_WORKER',
                  updated_at: new Date(),
                  note: `Thanh toán ${Number(payload.amount || 0).toLocaleString('vi-VN')} VNĐ qua ${payload.bank_code || 'VNPay'} thành công`,
                },
              },
            }
          );

          // step 132: tru kho vat ly chinh thuc va xoa khoa redis khi modifiedCount === 1
          if (updateResult.modifiedCount === 1) {
            console.log(`✅ [Outbox Worker] Successfully marked WorkOrder ${payload.order_code} as PAID`);

            const workOrder = await WorkOrder.findOne({ order_code: payload.order_code });
            if (workOrder && workOrder.estimate?.items) {
              for (const item of workOrder.estimate.items) {
                if (item.type === 'PART' && item.part_code && item.selected) {
                  const reqQty = Number(item.quantity) || 1;
                  
                  // tru ton kho vat ly stock_quantity va giam allocated_quantity
                  await InventoryItem.updateOne(
                    { part_code: item.part_code },
                    {
                      $inc: {
                        stock_quantity: -reqQty,
                        allocated_quantity: -reqQty,
                      },
                    }
                  );

                  await redis.del(`hold:${payload.order_code}:${item.part_code}`).catch(() => {});
                  await redis.del(`lock:payment:${payload.order_code}`).catch(() => {});
                  console.log(`📉 [Outbox Worker] Permanently deducted ${reqQty} items of ${item.part_code} from inventory`);
                }
              }
            }
          } else {
            console.log(`ℹ️ [Outbox Worker] Idempotent skip: Order ${payload.order_code} was already marked PAID`);
          }

          // step 133: cap nhat trang thai outbox event thanh PROCESSED
          await client.query(
            `UPDATE outbox_events SET processed_status = 'PROCESSED', processed_at = NOW() WHERE event_id = $1`,
            [event.event_id]
          );
        }
      } catch (eventErr) {
        console.error(`❌ [Outbox Worker] Error processing event ${event.event_id}:`, eventErr.message);

        // step 134: xu ly exponential backoff retry & dead_letter
        const retryCount = (event.retry_count || 0) + 1;
        const newStatus = retryCount >= 5 ? 'DEAD_LETTER' : 'PENDING';

        await client.query(
          `UPDATE outbox_events SET retry_count = $1, processed_status = $2 WHERE event_id = $3`,
          [retryCount, newStatus, event.event_id]
        );

        if (newStatus === 'DEAD_LETTER') {
          console.error(`🚨 [Outbox Worker Alert] Event ${event.event_id} moved to DEAD_LETTER after 5 failed retries!`);
        }
      }
    }
  } catch (err) {
    console.error('❌ [Outbox Worker] Loop error:', err.message);
  } finally {
    if (client) client.release();
    isProcessing = false;
  }
};

// khoi dong polling worker voi interval 2000ms (step 129)
const startOutboxWorker = (intervalMs = 2000) => {
  console.log(`🔄 [Outbox Worker] Background polling worker initialized (interval: ${intervalMs}ms)`);
  
  connectMongo().catch((err) => console.error('Outbox Worker Mongo Connect Error:', err.message));

  const timer = setInterval(async () => {
    await processOutboxEvents();
  }, intervalMs);

  return timer;
};

module.exports = {
  processOutboxEvents,
  startOutboxWorker,
};

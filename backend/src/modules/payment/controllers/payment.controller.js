const WorkOrder = require('../../work-order/models/work-order.model');
const { pool: pgPool } = require('../../../config/postgres');
const { createPaymentSessionLock } = require('../../inventory/services/inventory.service');
const { generateVnPayHash, verifyVnPayChecksum, formatVnPayDate } = require('../utils/vnpay');
const { sendSuccess } = require('../../../utils/response');
const { AppError } = require('../../../middlewares/errorHandler');

// step 117 - 120: khoi tao URL thanh toan vnpay va ghi postgres transaction
const createPaymentUrlController = async (req, res, next) => {
  try {
    const { order_code, bank_code } = req.body;

    if (!order_code) {
      return next(new AppError('Vui lòng cung cấp mã Lệnh sửa chữa order_code', 400, 'BAD_REQUEST'));
    }

    // 1. lay thong tin lenh sua chua tu mongodb
    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    const totalAmount = workOrder.estimate?.total_amount;
    if (!totalAmount || totalAmount <= 0) {
      return next(new AppError('Số tiền thanh toán cho Lệnh sửa chữa không hợp lệ', 400, 'INVALID_AMOUNT'));
    }

    // Kiem tra quy trinh nghiep vu gara: xe phai hoan thanh 100% thi cong & nghiem thu truoc khi mo thanh toan
    const ALLOWED_PAYMENT_STATUSES = ['COMPLETED', 'PAYMENT_PENDING'];
    if (!ALLOWED_PAYMENT_STATUSES.includes(workOrder.current_status)) {
      if (workOrder.payment_status === 'PAID' || workOrder.current_status === 'PAID') {
        return next(new AppError('Lệnh sửa chữa này đã được quyết toán thanh toán thành công trước đó.', 400, 'ALREADY_PAID'));
      }
      return next(new AppError(
        `Không thể tạo yêu cầu thanh toán: Xe đang ở trạng thái [${workOrder.current_status}]. Quy trình gara yêu cầu kỹ thuật viên hoàn tất 100% các công đoạn thi công và nghiệm thu an toàn (COMPLETED) trước khi thanh toán.`,
        400,
        'WORK_ORDER_NOT_COMPLETED'
      ));
    }

    // 2. tao khoa phan tan phien thanh toan 10 phut tren redis (step 118)
    await createPaymentSessionLock(order_code);

    // 3. tao ma vnp_TxnRef duy nhat va thoi gian het han +10 phut
    const now = new Date();
    const expireDate = new Date(now.getTime() + 10 * 60 * 1000); // +10 mins
    const vnp_TxnRef = `${order_code}_${Date.now()}`;
    const vnp_CreateDate = formatVnPayDate(now);
    const vnp_ExpireDate = formatVnPayDate(expireDate);

    // 4. chen ban ghi transaction vao postgresql (step 119)
    const insertQuery = `
      INSERT INTO payment_transactions (order_code, vnp_txn_ref, amount, status, payment_link_expires_at)
      VALUES ($1, $2, $3, 'PENDING', $4)
      RETURNING txn_id;
    `;
    await pgPool.query(insertQuery, [order_code, vnp_TxnRef, totalAmount, expireDate]);

    // 5. dung tham so URL thanh toan vnpay sandbox (step 120)
    const tmnCode = process.env.VNP_TMN_CODE || 'TESTTMN01';
    const secretKey = process.env.VNP_HASH_SECRET || 'SECRETSECRET1234567890';
    const vnpUrl = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = process.env.VNP_RETURN_URL || 'http://localhost:5000/api/v1/payments/vnpay_return';

    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef,
      vnp_OrderInfo: `Thanh toan lenh sua chua ${order_code}`,
      vnp_OrderType: 'other',
      vnp_Amount: totalAmount * 100, // vnpay tinh theo dong (x100)
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: typeof ipAddr === 'string' ? ipAddr.split(',')[0].trim() : '127.0.0.1',
      vnp_CreateDate,
      vnp_ExpireDate,
    };

    if (bank_code) {
      vnpParams['vnp_BankCode'] = bank_code;
    }

    const { querystring, vnpSecureHash } = generateVnPayHash(vnpParams, secretKey);
    const finalPaymentUrl = `${vnpUrl}?${querystring}&vnp_SecureHash=${vnpSecureHash}`;

    return sendSuccess(
      res,
      {
        order_code,
        vnp_txn_ref: vnp_TxnRef,
        amount: totalAmount,
        payment_url: finalPaymentUrl,
        expires_at: expireDate,
      },
      'Khởi tạo liên kết thanh toán VNPay VietQR thành công'
    );
  } catch (err) {
    next(err);
  }
};

// step 121 - 128: controller tiep nhan ipn webhook tu vnpay (postgresql acid + outbox event)
const vnpayIpnController = async (req, res, next) => {
  try {
    const vnpParams = req.query;
    const secretKey = process.env.VNP_HASH_SECRET || 'SECRETSECRET1234567890';

    // 1. xac thuc checksum HMAC-SHA512 (step 122)
    const isValidChecksum = verifyVnPayChecksum(vnpParams, secretKey);
    if (!isValidChecksum) {
      return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }

    const vnp_TxnRef = vnpParams['vnp_TxnRef'];
    const vnp_Amount = parseInt(vnpParams['vnp_Amount'], 10) / 100;
    const vnp_ResponseCode = vnpParams['vnp_ResponseCode'];
    const vnp_BankCode = vnpParams['vnp_BankCode'] || 'VNPAY';

    // 2. kiem tra giao dich trong postgresql (step 123)
    const selectRes = await pgPool.query('SELECT * FROM payment_transactions WHERE vnp_txn_ref = $1', [vnp_TxnRef]);
    if (selectRes.rows.length === 0) {
      return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }

    const transaction = selectRes.rows[0];

    if (transaction.status === 'SUCCESS') {
      return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    // 3. kiem tra khop so tien (step 124)
    if (Math.abs(transaction.amount - vnp_Amount) > 1) {
      return res.status(200).json({ RspCode: '04', Message: 'Invalid amount' });
    }

    // 4. bat dau postgresql acid transaction (step 125)
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      if (vnp_ResponseCode === '00') {
        // update postgres transaction thanh SUCCESS (step 126)
        await client.query(
          `UPDATE payment_transactions 
           SET status = 'SUCCESS', vnp_bank_code = $1, completed_at = NOW() 
           WHERE vnp_txn_ref = $2`,
          [vnp_BankCode, vnp_TxnRef]
        );

        // ghi su kien outbox PENDING trong CUM transaction (step 127)
        const payload = JSON.stringify({
          order_code: transaction.order_code,
          vnp_txn_ref: vnp_TxnRef,
          amount: vnp_Amount,
          bank_code: vnp_BankCode,
          paid_at: new Date().toISOString(),
        });

        await client.query(
          `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, processed_status)
           VALUES ('WORK_ORDER', $1, 'PAYMENT_COMPLETED', $2, 'PENDING')`,
          [transaction.order_code, payload]
        );
      } else {
        // giao dich thieu hieu luc / huy
        await client.query(
          `UPDATE payment_transactions SET status = 'FAILED' WHERE vnp_txn_ref = $1`,
          [vnp_TxnRef]
        );
      }

      // commit postgres transaction (step 128)
      await client.query('COMMIT');
      return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('VNPay IPN Error:', err.message);
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
};

// controller xu ly chuyen huong khi nguoi dung hoan tat thanh toan tren trinh duyat
const vnpayReturnController = async (req, res, next) => {
  try {
    const vnpParams = req.query;
    const secretKey = process.env.VNP_HASH_SECRET || 'SECRETSECRET1234567890';

    const isValidChecksum = verifyVnPayChecksum(vnpParams, secretKey);
    const responseCode = vnpParams['vnp_ResponseCode'];
    const txnRef = vnpParams['vnp_TxnRef'];

    return sendSuccess(
      res,
      {
        isValidChecksum,
        responseCode,
        txnRef,
        isSuccess: isValidChecksum && responseCode === '00',
      },
      isValidChecksum && responseCode === '00'
        ? 'Thanh toán qua cổng VNPay thành công'
        : 'Thanh toán qua cổng VNPay thất bại hoặc bị hủy'
    );
  } catch (err) {
    next(err);
  }
};

// Controller xac nhan thanh toan truc tiep (VietQR hoac chuyen khoan ngan hang MB Bank)
const confirmPaymentController = async (req, res, next) => {
  try {
    const { order_code, payment_method = 'VIETQR', bank_code = 'MB' } = req.body;

    if (!order_code) {
      return next(new AppError('Vui lòng cung cấp mã Lệnh sửa chữa order_code', 400, 'BAD_REQUEST'));
    }

    const workOrder = await WorkOrder.findOne({ order_code });
    if (!workOrder) {
      return next(new AppError(`Không tìm thấy Lệnh sửa chữa [${order_code}]`, 404, 'WORK_ORDER_NOT_FOUND'));
    }

    const amount = workOrder.estimate?.total_amount || 0;
    const now = new Date();

    // Kiem tra quy trinh nghiep vu gara: xe phai hoan thanh 100% thi cong & nghiem thu truoc khi quyet toan
    const ALLOWED_PAYMENT_STATUSES = ['COMPLETED', 'PAYMENT_PENDING'];
    if (!ALLOWED_PAYMENT_STATUSES.includes(workOrder.current_status)) {
      if (workOrder.payment_status === 'PAID' || workOrder.current_status === 'PAID') {
        return sendSuccess(
          res,
          {
            order_code,
            payment_status: 'PAID',
            current_status: 'PAID',
            amount,
            paid_at: workOrder.paid_at,
          },
          'Lệnh sửa chữa này đã được quyết toán thanh toán thành công trước đó.'
        );
      }
      return next(new AppError(
        `Không thể xác nhận thanh toán: Xe đang ở trạng thái [${workOrder.current_status}]. Quy trình gara yêu cầu kỹ thuật viên hoàn tất 100% các công đoạn thi công và nghiệm thu an toàn (COMPLETED) trước khi thanh toán.`,
        400,
        'WORK_ORDER_NOT_COMPLETED'
      ));
    }

    // 1. Cap nhat WorkOrder trong MongoDB
    workOrder.payment_status = 'PAID';
    workOrder.current_status = 'PAID';
    workOrder.paid_at = now;
    workOrder.workflow_timeline.push({
      status: 'PAID',
      updated_by: req.user?.phone_number || 'CUSTOMER',
      updated_at: now,
      note: `Xác nhận thanh toán ${amount.toLocaleString('vi-VN')} đ thành công qua ${payment_method} (${bank_code} Bank 0797526990)`,
    });
    await workOrder.save();

    // 2. Ghi nhan PostgreSQL ACID transaction
    try {
      const vnp_TxnRef = `${order_code}_${Date.now()}`;
      await pgPool.query(
        `INSERT INTO payment_transactions (order_code, vnp_txn_ref, amount, status, vnp_bank_code, completed_at)
         VALUES ($1, $2, $3, 'SUCCESS', $4, NOW())`,
        [order_code, vnp_TxnRef, amount, bank_code]
      );
    } catch (pgErr) {
      console.warn('PG Transaction Log Error:', pgErr.message);
    }

    // 3. Tru kho vat ly MongoDB va xoa khoa giu cho Redis
    try {
      const InventoryItem = require('../../inventory/models/inventory.model');
      const { redis } = require('../../../config/redis');
      if (workOrder.estimate?.items) {
        for (const item of workOrder.estimate.items) {
          if (item.type === 'PART' && item.part_code && item.selected) {
            const reqQty = Number(item.quantity) || 1;
            await InventoryItem.updateOne(
              { part_code: item.part_code },
              { $inc: { stock_quantity: -reqQty, allocated_quantity: -reqQty } }
            ).catch(() => {});
            await redis.del(`hold:${order_code}:${item.part_code}`).catch(() => {});
            await redis.del(`lock:payment:${order_code}`).catch(() => {});
          }
        }
      }
    } catch (invErr) {
      console.warn('Inventory deduction error:', invErr.message);
    }

    // 4. Phat tin hieu Realtime Socket.io neu co
    const io = req.app.get('socketio');
    if (io) {
      io.emit('PAYMENT_COMPLETED_EVENT', {
        order_code,
        amount,
        paid_at: now,
        customer_name: workOrder.customer_name,
        license_plate: workOrder.license_plate,
      });
    }

    return sendSuccess(
      res,
      {
        order_code,
        payment_status: 'PAID',
        current_status: 'PAID',
        paid_at: now,
        amount,
      },
      'Xác nhận thanh toán và quyết toán hóa đơn điện tử thành công!'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPaymentUrlController,
  vnpayIpnController,
  vnpayReturnController,
  confirmPaymentController,
};

const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const Vehicle = require('../../vehicle/models/vehicle.model');
const { redis, REDIS_KEYS } = require('../../../config/redis');
const { generateSecureOtp, hashOtp } = require('../../../utils/crypto');
const { sendOtpEmail } = require('../services/email.service');
const { sendSuccess } = require('../../../utils/response');
const { AppError } = require('../../../middlewares/errorHandler');

// ham che giau email bao mat (minhthao@gmail.com -> m***o@gmail.com)
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '***@***.com';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  const maskedName = `${name[0]}***${name[name.length - 1]}`;
  return `${maskedName}@${domain}`;
};

// controller xu ly yeu cau gui otp (uc-01)
const requestOtpController = async (req, res, next) => {
  try {
    const normalizedPlate = req.normalizedPlate || req.body.license_plate?.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedPhone = req.normalizedPhone || req.body.phone_number?.trim().replace(/\s+/g, '');

    if (!normalizedPlate || !normalizedPhone) {
      return next(new AppError('Vui lòng nhập số điện thoại và biển số xe', 400, 'BAD_REQUEST'));
    }

    // 1. truy van doi soat kep tren mongodb customer
    let customer = req.customer;
    if (!customer) {
      customer = await Customer.findOne({
        phone_number: normalizedPhone,
        'vehicles_owned.license_plate': normalizedPlate,
      });
    }

    // 2. xu ly ngoai le doi soat khong khop
    if (!customer) {
      const vehicleExists = await Vehicle.findOne({ license_plate: normalizedPlate });
      if (vehicleExists) {
        return next(
          new AppError(
            `Số điện thoại [${normalizedPhone}] không trùng khớp với chủ phương tiện đăng ký xe [${normalizedPlate}]`,
            403,
            'PHONE_PLATE_MISMATCH'
          )
        );
      } else {
        return next(
          new AppError(
            `Biển số xe [${normalizedPlate}] chưa từng làm dịch vụ tại trung tâm HIHIHAHA_AUTO`,
            404,
            'VEHICLE_NOT_FOUND'
          )
        );
      }
    }

    // 3. sinh ma otp 6 so ngau nhien va bam sha256
    const otpCode = generateSecureOtp();
    const hashedOtp = hashOtp(otpCode);

    const otpKey = `otp:login:${normalizedPlate}`;
    const attemptsKey = `otp:attempts:${normalizedPlate}`;
    const cooldownKey = REDIS_KEYS.emailCooldown(customer.email);

    // luu hash otp va reset attempts count
    await redis.set(otpKey, hashedOtp, 'EX', 300); // ttl 5 phut
    await redis.set(cooldownKey, '1', 'EX', 60); // ttl 60s cooldown
    await redis.del(attemptsKey);

    // 4. gui email otp bat dong bo
    sendOtpEmail(customer.email, otpCode, customer.full_name).catch((err) => {
      console.error('Background Email send error:', err.message);
    });

    // 5. phan hoi email da duoc che giau cho client
    const maskedEmailStr = maskEmail(customer.email);

    return sendSuccess(
      res,
      {
        license_plate: normalizedPlate,
        masked_email: maskedEmailStr,
        expires_in_seconds: 300,
        cooldown_seconds: 60,
      },
      `Mã OTP xác thực đã được gửi đến email ${maskedEmailStr}. Vui lòng kiểm tra hòm thư.`
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  maskEmail,
  requestOtpController,
};

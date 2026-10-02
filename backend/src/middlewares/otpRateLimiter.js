const { redis, REDIS_KEYS } = require('../config/redis');
const { AppError } = require('./errorHandler');
const Customer = require('../modules/auth/models/customer.model');

// middleware gioi han luot yeu cau otp (60s cooldown va 5 lan/ngay)
const otpRateLimiter = async (req, res, next) => {
  try {
    const { phone_number, license_plate } = req.body;

    if (!phone_number || !license_plate) {
      return next(new AppError('Vui lòng cung cấp đầy đủ số điện thoại và biển số xe', 400, 'BAD_REQUEST'));
    }

    const normalizedPlate = license_plate.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedPhone = phone_number.trim().replace(/\s+/g, '');

    // tim customer de lay email kiem tra rate limit
    const customer = await Customer.findOne({
      phone_number: normalizedPhone,
      'vehicles_owned.license_plate': normalizedPlate,
    });

    if (!customer || !customer.email) {
      // chuyen tiep cho controller xu ly doi soat chi tiet (403/404)
      req.normalizedPlate = normalizedPlate;
      req.normalizedPhone = normalizedPhone;
      return next();
    }

    const email = customer.email;
    const cooldownKey = REDIS_KEYS.emailCooldown(email);
    const dailyKey = REDIS_KEYS.dailyEmailLimit(email);

    // 1. kiem tra cooldown 60s
    const isCooldown = await redis.get(cooldownKey);
    if (isCooldown) {
      const ttl = await redis.ttl(cooldownKey);
      return next(
        new AppError(`Vui lòng đợi ${ttl} giây trước khi yêu cầu gửi lại mã OTP mới`, 429, 'TOO_MANY_REQUESTS', {
          retry_after_seconds: ttl,
        })
      );
    }

    // 2. kiem tra gioi han 5 lan / 24h
    const currentRequests = await redis.incr(dailyKey);
    if (currentRequests === 1) {
      await redis.expire(dailyKey, 86400); // 24 gio
    }

    if (currentRequests > 5) {
      const dailyTtl = await redis.ttl(dailyKey);
      return next(
        new AppError('Bạn đã vượt quá giới hạn 5 lần yêu cầu OTP trong ngày. Vui lòng thử lại sau 24 giờ', 429, 'DAILY_LIMIT_EXCEEDED', {
          retry_after_seconds: dailyTtl,
        })
      );
    }

    req.customer = customer;
    req.normalizedPlate = normalizedPlate;
    req.normalizedPhone = normalizedPhone;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  otpRateLimiter,
};

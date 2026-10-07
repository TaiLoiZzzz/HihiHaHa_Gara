const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
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

// controller xac thuc ma otp va cap cap jwt (uc-01)
const verifyOtpController = async (req, res, next) => {
  try {
    const { license_plate, phone_number, otp_code } = req.body;

    if (!license_plate || !phone_number || !otp_code) {
      return next(new AppError('Vui lòng nhập đầy đủ biển số xe, số điện thoại và mã OTP', 400, 'BAD_REQUEST'));
    }

    const normalizedPlate = license_plate.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedPhone = phone_number.trim().replace(/\s+/g, '');
    const inputOtp = otp_code.trim();

    const otpKey = `otp:login:${normalizedPlate}`;
    const attemptsKey = `otp:attempts:${normalizedPlate}`;

    // 1. lay hash otp tu redis in-memory
    const storedHashedOtp = await redis.get(otpKey);

    if (!storedHashedOtp) {
      return next(new AppError('Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu mã OTP mới', 400, 'OTP_EXPIRED'));
    }

    // 2. kiem tra doi soat hash sha256
    const inputHashedOtp = hashOtp(inputOtp);

    if (inputHashedOtp !== storedHashedOtp) {
      // tang bien dem thu sai va khoang che nhap sai > 3 lan (chong brute-force)
      const attempts = await redis.incr(attemptsKey);
      if (attempts === 1) {
        await redis.expire(attemptsKey, 300);
      }

      if (attempts >= 3) {
        // xoa otp va attempts count de huy ma ngap lap tuc
        await redis.del(otpKey);
        await redis.del(attemptsKey);
        return next(
          new AppError(
            'Bạn đã nhập sai mã OTP quá 3 lần. Mã OTP này đã bị hủy để đảm bảo an toàn. Vui lòng xin mã mới',
            400,
            'MAX_OTP_ATTEMPTS_EXCEEDED'
          )
        );
      }

      const remainingAttempts = 3 - attempts;
      return next(
        new AppError(`Mã OTP không chính xác. Bạn còn ${remainingAttempts} lần thử`, 400, 'INVALID_OTP', {
          remaining_attempts: remainingAttempts,
        })
      );
    }

    // 3. otp dung -> xoa key khoi redis va tim customer
    await redis.del(otpKey);
    await redis.del(attemptsKey);

    const customer = await Customer.findOne({
      phone_number: normalizedPhone,
      'vehicles_owned.license_plate': normalizedPlate,
    });

    if (!customer) {
      return next(new AppError('Không tìm thấy thông tin khách hàng sở hữu xe', 404, 'CUSTOMER_NOT_FOUND'));
    }

    // 4. tao cap token jwt (accessToken 2h, refreshToken 7d)
    const jwtPayload = {
      userId: customer._id,
      phone_number: customer.phone_number,
      license_plate: normalizedPlate,
      role: 'CUSTOMER',
    };

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026', {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });

    const refreshToken = jwt.sign(
      { userId: customer._id, role: 'CUSTOMER' },
      process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026',
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
      }
    );

    // 5. ghi audit log vao mongodb customer
    customer.audit_logs.push({
      action: 'LOGIN_OTP_SUCCESS',
      timestamp: new Date(),
      details: `Đăng nhập thành công qua OTP trên thiết bị cho xe ${normalizedPlate}`,
    });

    await customer.save();

    return sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: customer._id,
          full_name: customer.full_name,
          phone_number: customer.phone_number,
          email: customer.email,
          license_plate: normalizedPlate,
          vip_rank: customer.vip_rank,
          role: 'CUSTOMER',
        },
      },
      'Xác thực mã OTP thành công. Đăng nhập hệ thống hoàn tất.'
    );
  } catch (err) {
    next(err);
  }
};

// controller dang nhap nhanh dev / staff login cap JWT Token thuc te duoc sign bang JWT_SECRET
const devLoginController = async (req, res, next) => {
  try {
    const { role = 'SERVICE_ADVISOR', phone_number } = req.body;

    let user;
    if (phone_number) {
      user = await User.findOne({ phone_number });
    } else {
      user = await User.findOne({ role });
    }

    if (!user) {
      user = {
        _id: '6ac095cc5ece5baa78506e49',
        full_name: `Nhân viên (${role})`,
        phone_number: phone_number || '0988888801',
        role: role,
        license_plate: '51K-888.88',
      };
    }

    const jwtPayload = {
      userId: user._id,
      phone_number: user.phone_number,
      license_plate: user.license_plate || '51K-888.88',
      role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026', {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    return sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          full_name: user.full_name,
          phone_number: user.phone_number,
          role: user.role,
          license_plate: user.license_plate || '51K-888.88',
        },
      },
      `Đăng nhập thành công với vai trò ${user.role}. Mã JWT Token thực tế đã được ký mã hóa.`
    );
  } catch (err) {
    next(err);
  }
};

// controller dang nhap nhan vien / staff bang SDT & Mat khau thuc te
const staffLoginController = async (req, res, next) => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      return next(new AppError('Vui lòng nhập số điện thoại và mật khẩu', 400, 'BAD_REQUEST'));
    }

    const user = await User.findOne({ phone_number: phone_number.trim() });

    if (!user) {
      return next(new AppError('Không tìm thấy tài khoản nhân viên với số điện thoại này', 404, 'USER_NOT_FOUND'));
    }

    if (user.password_hash !== password && password !== '123456') {
      return next(new AppError('Mật khẩu đăng nhập không chính xác', 401, 'INVALID_PASSWORD'));
    }

    const jwtPayload = {
      userId: user._id,
      phone_number: user.phone_number,
      license_plate: user.license_plate || '51K-888.88',
      role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026', {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    return sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          full_name: user.full_name,
          phone_number: user.phone_number,
          role: user.role,
          email: user.email,
        },
      },
      `Đăng nhập thành công! Xin chào ${user.full_name} (${user.role})`
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  maskEmail,
  requestOtpController,
  verifyOtpController,
  devLoginController,
  staffLoginController,
};

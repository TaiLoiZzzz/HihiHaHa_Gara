const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

// ma tran 6 vai tro trong he thong gara
const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SERVICE_ADVISOR: 'SERVICE_ADVISOR',
  WORKSHOP_MANAGER: 'WORKSHOP_MANAGER',
  TECHNICIAN: 'TECHNICIAN',
  WAREHOUSE_KEEPER: 'WAREHOUSE_KEEPER',
  OWNER: 'OWNER',
};

// middleware giai ma va xac thuc bearer jwt token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Yêu cầu cung cấp mã xác thực JWT trong Header Authorization (Bearer <token>)', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'HIHIHAHA_SUPER_SECRET_KEY_2026');
    req.user = {
      userId: decoded.userId || decoded.id,
      role: decoded.role || ROLES.CUSTOMER,
      phone_number: decoded.phone_number || decoded.phone,
      license_plate: decoded.license_plate,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Mã xác thực JWT đã hết hạn, vui lòng đăng nhập lại', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Mã xác thực JWT không hợp lệ', 401, 'INVALID_TOKEN'));
  }
};

// middleware phan quyen theo vai tro rbac (role-based access control)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Không tìm thấy thông tin vai trò người dùng trong request', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Bạn không có quyền thực hiện thao tác này. Vai trò hiện tại [${req.user.role}] không nằm trong danh sách được phép [${allowedRoles.join(', ')}]`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
};

module.exports = {
  ROLES,
  verifyToken,
  authorizeRoles,
};

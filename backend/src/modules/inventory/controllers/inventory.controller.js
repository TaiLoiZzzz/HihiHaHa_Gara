const InventoryItem = require('../models/inventory.model');
const { sendSuccess } = require('../../../utils/response');
const { AppError } = require('../../../middlewares/errorHandler');

// 1. them moi phu tung vao kho
const createPartController = async (req, res, next) => {
  try {
    const { part_code, part_name, category, unit, cost_price, retail_price, stock_quantity, location_rack } = req.body;

    if (!part_code || !part_name || !cost_price || !retail_price || !location_rack) {
      return next(new AppError('Vui lòng cung cấp đầy đủ thông tin mã, tên, giá và vị trí kệ kho', 400, 'BAD_REQUEST'));
    }

    const existingPart = await InventoryItem.findOne({ part_code });
    if (existingPart) {
      return next(new AppError(`Mã phụ tùng [${part_code}] đã tồn tại trong danh mục`, 409, 'PART_EXISTS'));
    }

    const part = await InventoryItem.create({
      part_code: part_code.trim(),
      part_name: part_name.trim(),
      category: category || 'GENERAL',
      unit: unit || 'CÁI',
      cost_price: Number(cost_price),
      retail_price: Number(retail_price),
      stock_quantity: Number(stock_quantity) || 0,
      location_rack: location_rack.trim(),
    });

    return sendSuccess(res, part, 'Thêm mới phụ tùng vào kho thành công', 201);
  } catch (err) {
    next(err);
  }
};

// 2. chinh sua thong tin & gia ban le
const updatePartController = async (req, res, next) => {
  try {
    const { part_code } = req.params;
    const updateData = req.body;

    const part = await InventoryItem.findOne({ part_code, is_active: true });
    if (!part) {
      return next(new AppError(`Không tìm thấy phụ tùng [${part_code}]`, 404, 'PART_NOT_FOUND'));
    }

    Object.assign(part, updateData);
    await part.save();

    return sendSuccess(res, part, 'Cập nhật thông tin phụ tùng thành công');
  } catch (err) {
    next(err);
  }
};

// 3. xoa mem phu tung (is_active: false)
const deletePartController = async (req, res, next) => {
  try {
    const { part_code } = req.params;

    const part = await InventoryItem.findOne({ part_code });
    if (!part) {
      return next(new AppError(`Không tìm thấy phụ tùng [${part_code}]`, 404, 'PART_NOT_FOUND'));
    }

    part.is_active = false;
    await part.save();

    return sendSuccess(res, { part_code, is_active: false }, 'Xóa mềm phụ tùng thành công');
  } catch (err) {
    next(err);
  }
};

// 4. lap phieu kiem ke & dieu chinh ton kho dinh ky dau thang (ST-YYYYMMDD-XX)
const createStockAdjustmentController = async (req, res, next) => {
  try {
    const { part_code, actual_quantity, reason_category, note } = req.body;

    if (!part_code || actual_quantity === undefined) {
      return next(new AppError('Vui lòng nhập mã phụ tùng và số lượng thực tế kiểm đếm', 400, 'BAD_REQUEST'));
    }

    const part = await InventoryItem.findOne({ part_code });
    if (!part) {
      return next(new AppError(`Không tìm thấy phụ tùng [${part_code}]`, 404, 'PART_NOT_FOUND'));
    }

    const previousQty = part.stock_quantity;
    const actualQty = Number(actual_quantity);
    const variance = actualQty - previousQty;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const voucher_code = `ST-${dateStr}-${randomSuffix}`;

    part.adjustment_history.push({
      voucher_code,
      adjusted_at: new Date(),
      adjusted_by: req.user?.phone_number || 'WAREHOUSE_KEEPER',
      previous_quantity: previousQty,
      new_quantity: actualQty,
      variance,
      reason_category: reason_category || 'KIỂM_KÊ_ĐẦU_THÁNG',
      note: note || `Điều chỉnh tồn kho thực tế (${previousQty} -> ${actualQty})`,
    });

    part.stock_quantity = actualQty;
    await part.save();

    return sendSuccess(
      res,
      {
        voucher_code,
        part_code,
        previous_quantity: previousQty,
        actual_quantity: actualQty,
        variance,
        stock_quantity: part.stock_quantity,
      },
      'Lập phiếu kiểm kê và điều chỉnh tồn kho thành công'
    );
  } catch (err) {
    next(err);
  }
};

// 5. truy van danh sach kho phu tung
const getInventoryItemsController = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = { is_active: true };

    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const items = await InventoryItem.find(query).sort({ updatedAt: -1 });
    return sendSuccess(res, items, 'Lấy danh sách tồn kho thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPartController,
  updatePartController,
  deletePartController,
  createStockAdjustmentController,
  getInventoryItemsController,
};

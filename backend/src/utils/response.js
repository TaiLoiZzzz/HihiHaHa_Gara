// ham dinh dang phan hoi thanh cong
const sendSuccess = (res, data = null, message = 'Thao tác thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

// ham dinh dang phan hoi thoi
const sendError = (res, message = 'Thao tác thất bại', statusCode = 400, details = null, errorCode = 'BAD_REQUEST') => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorCode,
    details,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};

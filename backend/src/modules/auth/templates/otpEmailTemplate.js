// mau html email thu xac thuc otp
const renderOtpEmailTemplate = (otpCode, customerName = 'Quý khách') => {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã Xác Thực OTP - HIHIHAHA AUTO</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; color: #38bdf8; }
    .header p { margin: 5px 0 0 0; font-size: 14px; color: #94a3b8; }
    .body { padding: 40px 30px; text-align: center; color: #334155; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
    .desc { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 25px; }
    .otp-box { background-color: #f0fdf4; border: 2px dashed #22c55e; border-radius: 10px; padding: 20px; display: inline-block; margin: 10px 0 25px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; color: #15803d; letter-spacing: 8px; }
    .warning { font-size: 13px; color: #eab308; background-color: #fefce8; border: 1px solid #fef08a; padding: 12px 16px; border-radius: 8px; margin-bottom: 25px; text-align: left; }
    .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚘 HIHIHAHA AUTO SERVICE</h1>
      <p>TRUNG TÂM BẢO DƯỠNG & CHĂM SÓC Ô TÔ CHUYÊN NGHIỆP</p>
    </div>
    <div class="body">
      <div class="greeting">Xin chào ${customerName},</div>
      <div class="desc">Bạn đang thực hiện đăng nhập vào Cổng thông tin khách hàng dịch vụ sửa chữa ô tô HIHIHAHA_AUTO. Vui lòng sử dụng mã OTP dưới đây để hoàn tất xác thực:</div>
      <div class="otp-box">
        <div class="otp-code">${otpCode}</div>
      </div>
      <div class="warning">
        ⚠️ <strong>Lưu ý bảo mật:</strong> Mã OTP có hiệu lực trong <strong>5 phút</strong>. Nhân viên HIHIHAHA_AUTO không bao giờ yêu cầu bạn cung cấp mã OTP này dưới bất kỳ hình thức nào.
      </div>
    </div>
    <div class="footer">
      Email này được gửi tự động từ hệ thống HIHIHAHA_AUTO.<br>
      Hotline hỗ trợ: 1900 888 999 | Email: hihihaha.auto.service@gmail.com
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  renderOtpEmailTemplate,
};

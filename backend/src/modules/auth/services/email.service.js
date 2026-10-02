const nodemailer = require('nodemailer');
require('dotenv').config();

// khoi tao nodemailer transporter voi gmail smtp
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'tailoi1606@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ham gui email otp nguyen ban html responsive
const sendOtpEmail = async (toEmail, otpCode, customerName = 'Khách hàng') => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mã xác thực OTP - HIHIHAHA AUTO</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0d6efd, #0a58ca); color: #ffffff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .otp-box { background: #eef2ff; border: 2px dashed #4f46e5; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0; }
        .otp-code { font-size: 36px; font-weight: 800; color: #4f46e5; letter-spacing: 8px; margin: 5px 0; }
        .warning { background: #fff3cd; color: #856404; padding: 12px 16px; border-radius: 6px; font-size: 14px; margin-top: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #6c757d; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HIHIHAHA AUTO SERVICE</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Trung Tâm Quản Lý & Bảo Dưỡng Ô Tô Cao Cấp</p>
        </div>
        <div class="content">
          <p>Xin chào <strong>${customerName}</strong>,</p>
          <p>Bạn đang thực hiện đăng nhập hoặc xác thực dịch vụ trên Portal Khách Hàng của <strong>HIHIHAHA AUTO</strong>. Mã OTP của bạn là:</p>
          
          <div class="otp-box">
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Mã XÁC THỰC DÙNG 1 LẦN (OTP)</div>
            <div class="otp-code">${otpCode}</div>
            <div style="font-size: 13px; color: #dc2626; font-weight: 600;">⚠️ Mã có hiệu lực trong 5 phút</div>
          </div>

          <p>Vui lòng không chia sẻ mã này cho bất kỳ ai (kể cả nhân viên cố vấn dịch vụ gara) để đảm bảo an toàn cho thông tin phương tiện của bạn.</p>

          <div class="warning">
            🛡️ <strong>Lưu ý an toàn:</strong> Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email hoặc liên hệ Hotline Gara để được hỗ trợ.
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 5px 0;"><strong>HIHIHAHA AUTO SERVICE CENTER</strong></p>
          <p style="margin: 0;">Hotline: 1900-8888 | Email: tailoi1606@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"HIHIHAHA AUTO SERVICE" <${process.env.GMAIL_USER || 'tailoi1606@gmail.com'}>`,
    to: toEmail,
    subject: `[HIHIHAHA AUTO] Mã OTP xác thực dịch vụ của bạn: ${otpCode}`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 [Email Service] Sent OTP email to ${toEmail} | MessageID: ${info.messageId}`);
  return info;
};

module.exports = {
  transporter,
  sendOtpEmail,
};

const nodemailer = require('nodemailer');
const logger = require('../../../utils/logger');
const { renderOtpEmailTemplate } = require('../templates/otpEmailTemplate');
require('dotenv').config();

// khoi tao nodemailer transporter
const createEmailTransporter = () => {
  const gmailUser = process.env.GMAIL_USER || 'hihihaha.auto.service@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // neu co gmail app password thi dung ssl port 465
  if (gmailPass && gmailPass !== 'abcd1234efgh5678') {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  // dev mode fallback
  return null;
};

// ham gui email otp xac thuc
const sendOtpEmail = async (recipientEmail, otpCode, customerName = 'Quý khách') => {
  try {
    const transporter = createEmailTransporter();

    // neu khong co gmail app pass thi in otp ra console log ngau nhien
    if (!transporter) {
      logger.info(`📧 [Dev Email Service] OTP for [${recipientEmail}]: [${otpCode}] (Console Fallback)`);
      return { success: true, mode: 'CONSOLE_FALLBACK', messageId: 'DEV_LOG_ID' };
    }

    const htmlContent = renderOtpEmailTemplate(otpCode, customerName);

    const mailOptions = {
      from: `"HIHIHAHA_AUTO Garage" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `[HIHIHAHA_AUTO] Mã OTP xác thực đăng nhập: ${otpCode}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 [Email Service] Sent OTP email to ${recipientEmail} (MessageId: ${info.messageId})`);

    return { success: true, mode: 'GMAIL_SMTP', messageId: info.messageId };
  } catch (err) {
    logger.error(`❌ [Email Service] Failed to send OTP email to ${recipientEmail}: ${err.message}`);
    // console fallback khi gap loi smtp
    logger.info(`📧 [Dev Fallback Log] OTP for [${recipientEmail}]: [${otpCode}]`);
    return { success: false, error: err.message };
  }
};

// ham render html thong bao tiep nhan xe & kich hoat tai khoan chu xe
const renderIntakeConfirmationEmailTemplate = ({
  customerName,
  licensePlate,
  vehicleModel,
  orderCode,
  phone,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Xác nhận tiếp nhận xe dịch vụ</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
    <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 28px; text-align: center; border-bottom: 4px solid #f59e0b;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">HIHIHAHA AUTO</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Hệ Thống Dịch Vụ & Bảo Dưỡng Ô Tô Chuyên Nghiệp 4S</p>
      </div>
      
      <div style="padding: 28px 24px;">
        <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Kính gửi Quý khách ${customerName},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Gara <strong>HIHIHAHA AUTO</strong> xin trân trọng thông báo phương tiện của Quý khách đã được tiếp nhận thành công vào xưởng dịch vụ để tiến hành kiểm tra và bảo dưỡng.
        </p>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">📋 Thông Tin Tiếp Nhận Dịch Vụ</h3>
          <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #64748b; width: 150px;">Mã Lệnh Sửa Chữa:</td>
              <td style="padding: 5px 0; font-weight: bold; font-family: monospace; color: #0f172a;">${orderCode}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Biển Số Xe:</td>
              <td style="padding: 5px 0; font-weight: bold; font-family: monospace; color: #d97706;">${licensePlate}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Dòng Xe:</td>
              <td style="padding: 5px 0; font-weight: 600; color: #0f172a;">${vehicleModel}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Số Điện Thoại:</td>
              <td style="padding: 5px 0; font-family: monospace; color: #0f172a;">${phone}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 14px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #065f46;">✨ Tài Khoản Cổng Chủ Xe Đã Được Kích Hoạt Tự Động</h3>
          <p style="font-size: 13px; line-height: 1.5; color: #047857; margin: 0 0 12px 0;">
            Quý khách có thể theo dõi trực tiếp hình ảnh xe trên cầu nâng, tiến độ từng hạng mục và duyệt báo giá điện tử chỉ với 2 thông tin:
          </p>
          <ul style="font-size: 13px; color: #065f46; margin: 0 0 16px 20px; padding: 0;">
            <li>Biển số xe: <strong>${licensePlate}</strong></li>
            <li>Số điện thoại: <strong>${phone}</strong></li>
          </ul>
          <div style="text-align: center;">
            <a href="http://localhost:8888/login" style="display: inline-block; background-color: #f59e0b; color: #0f172a; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-transform: uppercase;">
              Truy Cập Cổng Theo Dõi Tiến Độ Xe
            </a>
          </div>
          <p style="font-size: 11px; color: #059669; text-align: center; margin: 10px 0 0 0;">
            (Khi đăng nhập, mã xác thực OTP sẽ được gửi trực tiếp về địa chỉ Gmail này của Quý khách)
          </p>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px;">
          Nếu Quý khách có bất kỳ thắc mắc nào, vui lòng liên hệ hotline Gara: <strong>0797526990</strong> hoặc phản hồi trực tiếp email này.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">HIHIHAHA AUTO - Số 1 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// ham gui email tiep nhan xe & kich hoat tai khoan
const sendIntakeConfirmationEmail = async ({
  recipientEmail,
  customerName,
  licensePlate,
  vehicleModel,
  orderCode,
  phone,
}) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      logger.info(`📧 [Dev Email Service] Intake confirmation for [${recipientEmail}] (${orderCode}) (Console Fallback)`);
      return { success: true, mode: 'CONSOLE_FALLBACK' };
    }

    const htmlContent = renderIntakeConfirmationEmailTemplate({
      customerName,
      licensePlate,
      vehicleModel,
      orderCode,
      phone,
    });

    const mailOptions = {
      from: `"HIHIHAHA_AUTO Garage" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `[HIHIHAHA AUTO] Xác nhận tiếp nhận xe [${licensePlate}] - Lệnh #${orderCode}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 [Email Service] Sent intake confirmation email to ${recipientEmail} (MessageId: ${info.messageId})`);
    return { success: true, mode: 'GMAIL_SMTP', messageId: info.messageId };
  } catch (err) {
    logger.error(`❌ [Email Service] Failed to send intake confirmation to ${recipientEmail}: ${err.message}`);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendOtpEmail,
  sendIntakeConfirmationEmail,
};

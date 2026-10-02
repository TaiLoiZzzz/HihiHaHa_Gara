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

module.exports = {
  sendOtpEmail,
};

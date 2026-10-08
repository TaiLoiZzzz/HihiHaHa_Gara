const nodemailer = require('nodemailer');
const logger = require('../../../utils/logger');
const {
  renderOtpEmailTemplate,
  renderIntakeConfirmationEmailTemplate,
  renderEstimateApprovalEmailTemplate,
  renderCompletionInvoiceEmailTemplate,
} = require('../templates/emailTemplates');
require('dotenv').config();

const DEFAULT_BASE_URL = process.env.APP_PUBLIC_URL || 'https://hihihahagara.quachtailoi.id.vn';

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

// 1. ham gui email otp xac thuc
const sendOtpEmail = async (recipientEmail, otpCode, customerName = 'Quý khách') => {
  try {
    const transporter = createEmailTransporter();

    // neu khong co gmail app pass thi in otp ra console log
    if (!transporter) {
      logger.info(`📧 [Dev Email Service] OTP for [${recipientEmail}]: [${otpCode}] (Console Fallback)`);
      return { success: true, mode: 'CONSOLE_FALLBACK', messageId: 'DEV_LOG_ID' };
    }

    const htmlContent = renderOtpEmailTemplate(otpCode, customerName, DEFAULT_BASE_URL);

    const mailOptions = {
      from: `"HIHIHAHA AUTO GARA" <${process.env.GMAIL_USER || 'hihihaha.auto.service@gmail.com'}>`,
      to: recipientEmail,
      subject: `[HIHIHAHA AUTO] Mã OTP xác thực đăng nhập: ${otpCode}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 [Email Service] Sent OTP email to ${recipientEmail} (MessageId: ${info.messageId})`);

    return { success: true, mode: 'GMAIL_SMTP', messageId: info.messageId };
  } catch (err) {
    logger.error(`❌ [Email Service] Failed to send OTP email to ${recipientEmail}: ${err.message}`);
    logger.info(`📧 [Dev Fallback Log] OTP for [${recipientEmail}]: [${otpCode}]`);
    return { success: false, error: err.message };
  }
};

// 2. ham gui email tiep nhan xe & kich hoat tai khoan chu xe
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
      baseUrl: DEFAULT_BASE_URL,
    });

    const mailOptions = {
      from: `"HIHIHAHA AUTO GARA" <${process.env.GMAIL_USER || 'hihihaha.auto.service@gmail.com'}>`,
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

// 3. ham gui email bao gia & ky duyet dien tu
const sendEstimateApprovalEmail = async ({
  recipientEmail,
  customerName,
  licensePlate,
  orderCode,
  totalAmount,
  items,
}) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      logger.info(`📧 [Dev Email Service] Estimate email for [${recipientEmail}] (${orderCode}) (Console Fallback)`);
      return { success: true, mode: 'CONSOLE_FALLBACK' };
    }

    const htmlContent = renderEstimateApprovalEmailTemplate({
      customerName,
      licensePlate,
      orderCode,
      totalAmount,
      items,
      baseUrl: DEFAULT_BASE_URL,
    });

    const mailOptions = {
      from: `"HIHIHAHA AUTO GARA" <${process.env.GMAIL_USER || 'hihihaha.auto.service@gmail.com'}>`,
      to: recipientEmail,
      subject: `[HIHIHAHA AUTO] Báo giá bảo dưỡng xe [${licensePlate}] - Lệnh #${orderCode}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 [Email Service] Sent estimate approval email to ${recipientEmail} (MessageId: ${info.messageId})`);
    return { success: true, mode: 'GMAIL_SMTP', messageId: info.messageId };
  } catch (err) {
    logger.error(`❌ [Email Service] Failed to send estimate approval to ${recipientEmail}: ${err.message}`);
    return { success: false, error: err.message };
  }
};

// 4. ham gui email hoan tat bao duong & hoa don
const sendCompletionInvoiceEmail = async ({
  recipientEmail,
  customerName,
  licensePlate,
  orderCode,
  totalAmount,
}) => {
  try {
    const transporter = createEmailTransporter();
    if (!transporter) {
      logger.info(`📧 [Dev Email Service] Completion email for [${recipientEmail}] (${orderCode}) (Console Fallback)`);
      return { success: true, mode: 'CONSOLE_FALLBACK' };
    }

    const htmlContent = renderCompletionInvoiceEmailTemplate({
      customerName,
      licensePlate,
      orderCode,
      totalAmount,
      baseUrl: DEFAULT_BASE_URL,
    });

    const mailOptions = {
      from: `"HIHIHAHA AUTO GARA" <${process.env.GMAIL_USER || 'hihihaha.auto.service@gmail.com'}>`,
      to: recipientEmail,
      subject: `[HIHIHAHA AUTO] Xe [${licensePlate}] đã hoàn tất bảo dưỡng - Sẵn sàng bàn giao`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 [Email Service] Sent completion email to ${recipientEmail} (MessageId: ${info.messageId})`);
    return { success: true, mode: 'GMAIL_SMTP', messageId: info.messageId };
  } catch (err) {
    logger.error(`❌ [Email Service] Failed to send completion email to ${recipientEmail}: ${err.message}`);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendOtpEmail,
  sendIntakeConfirmationEmail,
  sendEstimateApprovalEmail,
  sendCompletionInvoiceEmail,
};

/**
 * BỘ TEMPLATE EMAIL CHUẨN GIAO DIỆN & PHONG CÁCH HIHIHAHA GARA
 * Thiết kế tối ưu cho Gmail, Apple Mail, Outlook (hỗ trợ Dark Mode & Mobile Responsive)
 */

const DEFAULT_BASE_URL = process.env.APP_PUBLIC_URL || 'https://hihihahagara.quachtailoi.id.vn';
const LOGO_URL = `${DEFAULT_BASE_URL}/logo.png`;
const HOTLINE = '0797 526 990';
const ADDRESS = 'Số 1 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh';

/**
 * Khung sườn Email Layout dùng chung (Header nhận diện thương hiệu + Footer Gara)
 */
function renderEmailShell({ title, subtitle, badgeText, contentHtml, baseUrl = DEFAULT_BASE_URL }) {
  return `<!DOCTYPE html>
<html lang="vi" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title || 'HiHiHaHa Auto Garage'}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
      .content-padding { padding: 24px 16px !important; }
      .otp-digit-box { font-size: 32px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 0; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!-- Main Email Container (Max 600px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;" class="email-container">
          
          <!-- BRAND HEADER: Gradient Slate Dark + Gold Amber Border -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px 28px 24px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <!-- Logo Brand -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    <a href="${baseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="${LOGO_URL}" width="84" height="110" alt="HiHiHaHa Auto Logo" style="display: block; margin: 0 auto; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));" />
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Brand Name & Badge -->
              <h1 style="color: #f8fafc; font-size: 22px; font-weight: 900; letter-spacing: 1.5px; margin: 12px 0 4px 0; text-transform: uppercase;">
                HIHIHAHA <span style="color: #f59e0b;">GARA</span>
              </h1>
              <p style="color: #94a3b8; font-size: 13px; font-weight: 500; margin: 0 0 12px 0; letter-spacing: 0.5px;">
                HỆ THỐNG DỊCH VỤ & BẢO DƯỠNG Ô TÔ THÔNG MINH 4S
              </p>
              ${badgeText ? `
              <div style="display: inline-block; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 9999px; padding: 4px 14px;">
                <span style="color: #fbbf24; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">${badgeText}</span>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- EMAIL BODY CONTENT -->
          <tr>
            <td style="padding: 32px 28px;" class="content-padding">
              ${contentHtml}
            </td>
          </tr>

          <!-- GARAGE CONTACT & SUPPORT STRIP -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 13px; color: #64748b; line-height: 1.6;">
                    <strong style="color: #0f172a;">📞 Hotline Chăm sóc & Cứu hộ:</strong> <a href="tel:${HOTLINE.replace(/\s+/g, '')}" style="color: #d97706; text-decoration: none; font-weight: 700;">${HOTLINE}</a><br>
                    <strong style="color: #0f172a;">📍 Địa chỉ Xưởng:</strong> ${ADDRESS}<br>
                    <strong style="color: #0f172a;">🌐 Cổng Chủ Xe Trực Tuyến:</strong> <a href="${baseUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${baseUrl.replace(/^https?:\/\//, '')}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- COPYRIGHT FOOTER -->
          <tr>
            <td style="background-color: #0f172a; padding: 18px 24px; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0;">
                © ${new Date().getFullYear()} <strong>HiHiHaHa Auto Garage</strong>. Bản quyền thuộc về Trung Tâm Dịch Vụ Xe Hơi Thông Minh.<br>
                Email này được hệ thống gửi tự động. Quý khách vui lòng không chia sẻ mã bảo mật với bất kỳ ai.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. TEMPLATE EMAIL XÁC THỰC MÃ OTP (Đăng nhập Cổng Chủ Xe)
 */
function renderOtpEmailTemplate(otpCode, customerName = 'Quý khách', baseUrl = DEFAULT_BASE_URL) {
  const contentHtml = `
    <!-- Lời chào & Ngữ cảnh -->
    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Kính chào ${customerName},
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
      Quý khách vừa thực hiện yêu cầu đăng nhập vào <strong>Cổng thông tin chủ xe trực tuyến của HiHiHaHa Auto</strong>. Vui lòng nhập mã xác thực OTP dưới đây để hoàn tất đăng nhập:
    </p>

    <!-- Hộp chứa mã OTP nổi bật phong cách Gara -->
    <div style="background: linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%); border: 2px dashed #f59e0b; border-radius: 16px; padding: 24px; text-align: center; margin: 0 0 24px 0; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);">
      <div style="font-size: 12px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
        🔐 MÃ XÁC THỰC DÙNG 1 LẦN (OTP)
      </div>
      <div class="otp-digit-box" style="font-family: 'SF Mono', 'Cascadia Code', Menlo, Consolas, Monaco, monospace; font-size: 40px; font-weight: 900; color: #b45309; letter-spacing: 10px; line-height: 1.2; text-shadow: 0 1px 2px rgba(0,0,0,0.05);">
        ${otpCode}
      </div>
      <div style="font-size: 12px; color: #78350f; margin-top: 8px; font-weight: 500;">
        ⏳ Mã có hiệu lực trong vòng <strong>5 phút</strong>
      </div>
    </div>

    <!-- Cảnh báo bảo mật -->
    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px; margin: 0 0 24px 0;">
      <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin: 0;">
        <strong style="color: #0f172a;">⚠️ Lưu ý bảo mật quan trọng:</strong> Tuyệt đối không cung cấp mã OTP này cho bất kỳ ai, kể cả nhân viên kỹ thuật hay quản đốc xưởng dịch vụ.
      </p>
    </div>

    <!-- Nút hành động nhanh -->
    <div style="text-align: center; margin: 28px 0 12px 0;">
      <a href="${baseUrl}/login" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; text-decoration: none; font-weight: 900; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);">
        Mở Cổng Đăng Nhập Ngay ➔
      </a>
    </div>
  `;

  return renderEmailShell({
    title: `[HiHiHaHa Auto] Mã xác thực OTP: ${otpCode}`,
    badgeText: 'Xác Thực Đăng Nhập',
    contentHtml,
    baseUrl,
  });
}

/**
 * 2. TEMPLATE EMAIL XÁC NHẬN TIẾP NHẬN XE & KÍCH HOẠT TÀI KHOẢN THEO DÕI
 */
function renderIntakeConfirmationEmailTemplate({
  customerName = 'Quý khách',
  licensePlate,
  vehicleModel,
  orderCode,
  phone,
  baseUrl = DEFAULT_BASE_URL,
}) {
  const contentHtml = `
    <!-- Lời chúc mừng tiếp nhận -->
    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Kính chào ${customerName},
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
      Trung tâm dịch vụ <strong>HiHiHaHa Auto</strong> xin thông báo: Phương tiện của Quý khách đã được tiếp nhận thành công vào cầu nâng để kiểm tra tổng quát và lập hồ sơ bảo dưỡng.
    </p>

    <!-- Phiếu thông tin tiếp nhận xe -->
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);">
      <div style="background-color: #0f172a; padding: 12px 18px; display: flex; align-items: center;">
        <span style="color: #f59e0b; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
          📋 THÔNG TIN TIẾP NHẬN PHƯƠNG TIỆN
        </span>
      </div>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 18px; color: #64748b; width: 140px;">Mã Lệnh Sửa Chữa:</td>
          <td style="padding: 12px 18px; font-weight: 800; font-family: monospace; color: #0f172a; font-size: 14px;">
            ${orderCode}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 18px; color: #64748b;">Biển Số Xe:</td>
          <td style="padding: 12px 18px;">
            <span style="background-color: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-family: monospace; font-size: 14px;">
              ${licensePlate}
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 18px; color: #64748b;">Dòng Phương Tiện:</td>
          <td style="padding: 12px 18px; font-weight: 700; color: #0f172a;">
            ${vehicleModel || 'Theo hồ sơ gara'}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 18px; color: #64748b;">Số Điện Thoại Đăng Ký:</td>
          <td style="padding: 12px 18px; font-family: monospace; font-weight: 600; color: #0f172a;">
            ${phone}
          </td>
        </tr>
      </table>
    </div>

    <!-- Hộp Kích hoạt Cổng Theo Dõi Trực Tuyến -->
    <div style="background: linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 16px; padding: 22px; margin-bottom: 24px;">
      <div style="font-size: 14px; font-weight: 800; color: #065f46; margin-bottom: 8px;">
        ✨ TÀI KHOẢN CHỦ XE ĐÃ ĐƯỢC TỰ ĐỘNG KÍCH HOẠT
      </div>
      <p style="font-size: 13px; line-height: 1.6; color: #047857; margin: 0 0 14px 0;">
        Giờ đây, Quý khách có thể xem ảnh nghiệm thu trực tiếp từ thợ máy, theo dõi tiến độ từng phút và ký duyệt báo giá trực tuyến mà không cần đến gara:
      </p>
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #065f46; margin-bottom: 16px;">
        <tr>
          <td style="padding: 4px 0;">🔑 <strong>Biển số:</strong> <span style="font-family: monospace; font-weight: bold;">${licensePlate}</span></td>
        </tr>
        <tr>
          <td style="padding: 4px 0;">📱 <strong>Số điện thoại:</strong> <span style="font-family: monospace; font-weight: bold;">${phone}</span></td>
        </tr>
      </table>

      <div style="text-align: center;">
        <a href="${baseUrl}/customer" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 28px; border-radius: 10px; text-transform: uppercase; box-shadow: 0 4px 10px rgba(5, 150, 105, 0.3);">
          Theo Dõi Tiến Độ & Xem Ảnh Xe ➔
        </a>
      </div>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
      Sau khi chuyên viên kỹ thuật hoàn tất kiểm tra 24 hạng mục chuẩn hãng, bảng báo giá chi tiết sẽ được gửi trực tiếp đến cổng theo dõi của Quý khách.
    </p>
  `;

  return renderEmailShell({
    title: `[HiHiHaHa Auto] Tiếp nhận xe ${licensePlate} - Lệnh #${orderCode}`,
    badgeText: 'Tiếp Nhận Phương Tiện',
    contentHtml,
    baseUrl,
  });
}

/**
 * 3. TEMPLATE EMAIL BÁO GIÁ DỊCH VỤ & KÝ DUYỆT ĐIỆN TỬ
 */
function renderEstimateApprovalEmailTemplate({
  customerName = 'Quý khách',
  licensePlate,
  orderCode,
  totalAmount = 0,
  items = [],
  baseUrl = DEFAULT_BASE_URL,
}) {
  const formattedTotal = Number(totalAmount).toLocaleString('vi-VN') + ' đ';

  let itemsRows = '';
  if (items && items.length > 0) {
    itemsRows = items
      .map(
        (it, idx) => `
      <tr style="border-bottom: 1px solid #f1f5f9; ${idx % 2 === 1 ? 'background-color: #fafaf9;' : ''}">
        <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${it.name || it.part_name || 'Hạng mục dịch vụ'}</td>
        <td style="padding: 10px 14px; text-align: center; color: #64748b;">${it.quantity || 1}</td>
        <td style="padding: 10px 14px; text-align: right; font-weight: 700; color: #0f172a; font-family: monospace;">
          ${Number(it.unit_price || it.price || 0).toLocaleString('vi-VN')} đ
        </td>
      </tr>
    `
      )
      .join('');
  }

  const contentHtml = `
    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Kính chào ${customerName},
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
      Cố vấn dịch vụ <strong>HiHiHaHa Auto</strong> đã hoàn tất chẩn đoán kỹ thuật cho xe <strong>${licensePlate}</strong> và gửi tới Quý khách bảng dự toán báo giá bảo dưỡng:
    </p>

    <!-- Bảng dự toán chi phí -->
    <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #0f172a; color: #ffffff;">
            <th style="padding: 12px 14px; text-align: left; font-weight: 700;">Hạng Mục / Phụ Tùng</th>
            <th style="padding: 12px 14px; text-align: center; font-weight: 700; width: 60px;">SL</th>
            <th style="padding: 12px 14px; text-align: right; font-weight: 700; width: 110px;">Thành Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr style="background-color: #fffbeb; border-top: 2px solid #fde68a;">
            <td colspan="2" style="padding: 14px; font-weight: 800; color: #92400e; font-size: 14px;">TỔNG CỘNG DỰ TOÁN:</td>
            <td style="padding: 14px; text-align: right; font-weight: 900; color: #b45309; font-size: 16px; font-family: monospace;">
              ${formattedTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Nút Ký duyệt điện tử -->
    <div style="text-align: center; margin: 28px 0;">
      <a href="${baseUrl}/customer/orders/${orderCode}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; text-decoration: none; font-weight: 900; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);">
        Xem Chi Tiết & Ký Duyệt Báo Giá ➔
      </a>
    </div>
  `;

  return renderEmailShell({
    title: `[HiHiHaHa Auto] Báo giá bảo dưỡng xe ${licensePlate} - Lệnh #${orderCode}`,
    badgeText: 'Báo Giá Điện Tử',
    contentHtml,
    baseUrl,
  });
}

/**
 * 4. TEMPLATE EMAIL HOÀN TẤT BẢO DƯỠNG & HÓA ĐƠN ĐIỆN TỬ
 */
function renderCompletionInvoiceEmailTemplate({
  customerName = 'Quý khách',
  licensePlate,
  orderCode,
  totalAmount = 0,
  baseUrl = DEFAULT_BASE_URL,
}) {
  const formattedTotal = Number(totalAmount).toLocaleString('vi-VN') + ' đ';

  const contentHtml = `
    <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Kính chào ${customerName},
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
      Trung tâm <strong>HiHiHaHa Auto</strong> trân trọng thông báo phương tiện <strong>${licensePlate}</strong> đã hoàn tất toàn bộ các khâu bảo dưỡng, sửa chữa và kiểm tra an toàn xuất xưởng (KCS).
    </p>

    <!-- Hộp thông báo sẵn sàng nhận xe -->
    <div style="background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 16px; padding: 22px; text-align: center; margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 6px;">
        🚗 PHƯƠNG TIỆN ĐÃ SẴN SÀNG BÀN GIAO
      </div>
      <div style="font-size: 15px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px;">
        Xe đã được rửa sạch và đỗ tại khu vực bàn giao của Gara
      </div>
      <div style="font-size: 13px; color: #3b82f6;">
        Tổng chi phí thanh toán: <strong style="font-size: 16px; color: #1e40af; font-family: monospace;">${formattedTotal}</strong>
      </div>
    </div>

    <!-- Nút Xem Hóa đơn & Thanh toán VietQR -->
    <div style="text-align: center; margin: 28px 0 12px 0;">
      <a href="${baseUrl}/customer/payment/${orderCode}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
        Xem Hóa Đơn & Thanh Toán Trực Tuyến ➔
      </a>
    </div>
  `;

  return renderEmailShell({
    title: `[HiHiHaHa Auto] Phương tiện ${licensePlate} đã sẵn sàng bàn giao`,
    badgeText: 'Hoàn Tất Dịch Vụ',
    contentHtml,
    baseUrl,
  });
}

module.exports = {
  renderEmailShell,
  renderOtpEmailTemplate,
  renderIntakeConfirmationEmailTemplate,
  renderEstimateApprovalEmailTemplate,
  renderCompletionInvoiceEmailTemplate,
};

# BẢNG TÀI KHOẢN VÀ HƯỚNG DẪN KIỂM THỬ HỆ THỐNG HIHIHAHA AUTO

---

## 1. CỔNG ĐĂNG NHẬP KHÁCH HÀNG (CHỦ XE)
- **Đường dẫn truy cập:** `http://localhost:8888/login`
- **Phương thức xác thực:** Biển số xe + Số điện thoại + Email nhận mã xác thực OTP (Gửi thực tế qua Gmail SMTP)
- **Thông tin tài khoản kiểm thử chính thức:**
  - **Biển số xe:** `51K-888.88`
  - **Số điện thoại:** `0912345678`
  - **Email:** `tailoi1606@gmail.com`
  - **Mã OTP xác thực:** Kiểm tra hòm thư Gmail `tailoi1606@gmail.com` hoặc nhập mã xác thực chuẩn dùng ngay: **`123456`**
- **Quyền & Chức năng sau khi đăng nhập (`/customer`):**
  - Xem hồ sơ xe Toyota Camry 2.5Q, số khung VIN, hạng thành viên VIP GOLD.
  - Xem và Ký duyệt bảng báo giá điện tử 1-Click (`/customer/orders/WO-20261001-0089`).
  - Thanh toán trực tuyến quét mã VietQR MB Bank hoặc VNPay Sandbox (`/customer/payment/WO-20261001-0089`).
  - Theo dõi tiến độ xe trên cầu nâng và xem ảnh chụp nghiệm thu thời gian thực từ thợ máy.
  - Tự động lưu trữ và tra cứu Sổ Bảo Dưỡng Điện Tử trọn đời xe sau khi thanh toán.

---

## 2. CỔNG ĐĂNG NHẬP NỘI BỘ NHÂN VIÊN GARA (STAFF PORTAL)
- **Đường dẫn truy cập dùng chung:** `http://localhost:8888/staff/login`
- **Cơ chế:** Đăng nhập chung 1 cổng bằng Số điện thoại + Mật khẩu. Backend tự động phân quyền theo vai trò (Role-Based Access Control) và điều hướng về khu vực làm việc riêng biệt của từng chức danh.
- **Mật khẩu dùng chung cho tất cả cán bộ nhân viên:** **`123456`**

### 2.1. Cố Vấn Dịch Vụ (Service Advisor)
- **Số điện thoại:** `0988888801`
- **Họ tên:** Trần Cố Vấn (Quang Tùng)
- **Mật khẩu:** `123456`
- **Khu vực làm việc (`/advisor/work-orders`):**
  - Quản lý danh sách toàn bộ Lệnh Sửa Chữa (Work Orders).
  - Tiếp nhận xe mới, lập báo giá dự toán sơ bộ (`/advisor/create-order`) - Tự động tra cứu biển số xe `51K-888.88` và lưu trực tiếp vào cơ sở dữ liệu MongoDB.
  - Chỉnh sửa báo giá, tra cứu phụ tùng dùng chung qua cơ sở dữ liệu đồ thị Neo4j Cypher (`/advisor/orders/[order_code]/edit`).

### 2.2. Quản Đốc Xưởng (Workshop Manager)
- **Số điện thoại:** `0988888802`
- **Họ tên:** Lê Quản Đốc
- **Mật khẩu:** `123456`
- **Khu vực làm việc:**
  - **Bảng Kanban điều phối xưởng (`/manager/kanban`):** Kéo thả thẻ xe qua 6 công đoạn tiếp nhận -> chờ báo giá -> chờ vật tư -> đang thi công -> QC -> hoàn tất; tự động đồng bộ trạng thái Lệnh vào MongoDB.
  - **Quản lý Kho phụ tùng OEM (`/manager/inventory`):** Quản lý tồn kho, phân trang, tìm kiếm phụ tùng, cảnh báo dưới ngưỡng an toàn, lập phiếu kiểm kê ST-YYYYMMDD-XX.

### 2.3. Kỹ Thuật Viên / Thợ Máy (Technician)
- **Số điện thoại:** `0988888803`
- **Họ tên:** Phạm Thợ Xưởng (Mã: THO-01)
- **Mật khẩu:** `123456`
- **Mã PIN máy tính bảng Tablet khoang nâng:** `1234` hoặc `1357`
- **Khu vực làm việc (`/technician`):**
  - Màn hình cảm ứng Tablet đặt tại Khoang nâng #02.
  - Thanh trượt gạt tay điều chỉnh % tiến độ thi công đồng bộ Realtime Socket.io.
  - Danh sách Checklist kỹ thuật có thông số lực siết chuẩn N.m.
  - Chụp và tải ảnh nghiệm thu khoang nâng Trước/Sau (Evidence Photos) lưu trữ hồ sơ số của chủ xe.

### 2.4. Giám Đốc / Chủ Gara (Garage Owner)
- **Số điện thoại:** `0988888800`
- **Họ tên:** Hoàng Giám Đốc (CEO)
- **Mật khẩu:** `123456`
- **Khu vực làm việc (`/owner/dashboard`):**
  - Executive Dashboard báo cáo tài chính toàn diện.
  - Biểu đồ phân tích doanh thu phụ tùng, tiền công thợ, biên lợi nhuận ròng.
  - Bảng xếp hạng KPI năng suất và giờ công kỹ thuật viên hàng đầu.

---

## 3. THÔNG TIN LIÊN HỆ & THƯƠNG HIỆU GARA HIHIHAHA AUTO
- **Hotline:** `0797 526 990`
- **Email tiếp nhận:** `tailoi1606@gmail.com`
- **Địa chỉ trụ sở:** `Số 1 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh`
- **Logo chính thức:** `client/public/logo.png`
- **Đội ngũ & cơ sở vật chất:** `client/public/gara-team.png`

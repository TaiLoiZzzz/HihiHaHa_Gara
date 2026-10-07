# DANH SÁCH TÀI KHOẢN VÀ PHÂN QUYỀN TRUY CẬP HỆ THỐNG HIHIHAHA AUTO
**Hệ thống Quản Trị & Vận Hành Garage Ô Tô Chuẩn Enterprise**

---

## 1. CỔNG CHỦ XE / KHÁCH HÀNG (CUSTOMER PORTAL)
* **Đường dẫn truy cập:** `http://localhost:8888/login`
* **Cơ chế xác thực:** Biển số xe + Số điện thoại -> Gửi mã xác thực OTP 6 số (Không dùng mật khẩu thô).

| Trường thông tin | Dữ liệu đăng nhập thật trong Hệ Thống |
| :--- | :--- |
| **Biển số xe** | `51K-888.88` |
| **Số điện thoại** | `0912345678` |
| **Mã OTP xác thực** | `123456` (Mã xác thực tiêu chuẩn) |
| **Họ tên khách hàng** | Minh Thảo |
| **Phương tiện** | Toyota Camry 2.5Q 2022 |
| **Hạng thành viên** | VIP GOLD (Tích lũy 2.808 điểm) |
| **URL tự động chuyển vào** | `http://localhost:8888/customer` |
| **Các chức năng độc quyền** | - Xem tiến độ sửa chữa xe trên cầu nâng thời gian thực.<br>- Phê duyệt hoặc từ chối hạng mục báo giá phụ tùng online.<br>- Quét mã chuyển khoản VietQR tự động hoặc thanh toán thẻ qua VNPay Sandbox.<br>- Tra cứu lịch sử bảo dưỡng và tải hóa đơn điện tử VAT. |

---

## 2. CỔNG NỘI BỘ CÁN BỘ NHÂN VIÊN GARA (STAFF PORTAL)
* **Đường dẫn truy cập:** `http://localhost:8888/staff/login`
* **Cơ chế xác thực:** Số điện thoại nhân sự + Mật khẩu tài khoản nội bộ.
* **Cơ chế phân quyền:** Hệ thống tự động nhận diện Role từ JWT Token được Backend trả về và chuyển hướng chính xác đến phân hệ chuyên trách của từng vị trí (không dùng chung menu hay trộn lẫn chức năng).

---

### Vai trò 1: Cố Vấn Dịch Vụ (Service Advisor)
* **Số điện thoại:** `0988888801`
* **Mật khẩu:** `123456`
* **Họ tên nhân viên:** Trần Cố Vấn (Advisor)
* **Mã vai trò:** `SERVICE_ADVISOR`
* **URL sau khi đăng nhập:** `http://localhost:8888/advisor/work-orders`
* **Menu & Quyền hạn:**
  1. **Danh sách lệnh sửa chữa (`/advisor/work-orders`):** Quản lý toàn bộ Work Order của khách hàng.
  2. **Tiếp nhận & Lập lệnh mới (`/advisor/create-order`):** Check-in xe vào gara, kiểm tra ngoại quan 4 góc, ghi nhận tình trạng hỏng hóc.
  3. **Lập & Sửa báo giá (`/advisor/orders/[order_code]/edit`):** Đề xuất phụ tùng OEM, kiểm tra cây quan hệ tương thích Neo4j Cypher trước khi gửi khách.

---

### Vai trò 2: Quản Đốc Xưởng (Workshop Manager)
* **Số điện thoại:** `0988888802`
* **Mật khẩu:** `123456`
* **Họ tên nhân viên:** Lê Quản Đốc (Manager)
* **Mã vai trò:** `WORKSHOP_MANAGER`
* **URL sau khi đăng nhập:** `http://localhost:8888/manager/kanban`
* **Menu & Quyền hạn:**
  1. **Bảng Kanban 6 cột (`/manager/kanban`):** Điều phối luồng xe từ Tiếp nhận -> Báo giá -> Chờ duyệt -> Đang sửa -> Kiểm thử KCS -> Bàn giao. Kéo thả hoặc bấm chuyển trạng thái tức thời.
  2. **Kho phụ tùng OEM (`/manager/inventory`):** Quản lý 500 linh kiện, xem tồn thực tế, lọc theo danh mục, phân trang 15 mã/trang siêu tốc, lập Phiếu kiểm kê kho ST tự động cân bằng sổ sách.

---

### Vai trò 3: Kỹ Thuật Viên / Thợ Máy (Technician)
* **Số điện thoại:** `0988888803`
* **Mật khẩu:** `123456`
* **Họ tên nhân viên:** Phạm Thợ Xưởng (Tech)
* **Mã vai trò:** `TECHNICIAN`
* **URL sau khi đăng nhập:** `http://localhost:8888/technician`
* **Menu & Quyền hạn:**
  1. **Giao diện Tablet Khoang Nâng (`/technician`):** Tối ưu nút bấm to cho thao tác tay khi sửa xe.
  2. **Tiến độ công việc:** Cập nhật % hoàn thành từng công đoạn.
  3. **Upload ảnh hiện trường:** Chụp ảnh phụ tùng cũ/mới tải lên chứng minh cho khách.
  4. **AI Tra cứu & Chẩn đoán:** Hỗ trợ tìm mã lỗi OBD-II và sơ đồ đấu nối kỹ thuật.

---

### Vai trò 4: Giám Đốc / Chủ Gara (Garage Owner)
* **Số điện thoại:** `0988888800`
* **Mật khẩu:** `123456`
* **Họ tên nhân viên:** Nguyễn Chủ Gara (Executive)
* **Mã vai trò:** `OWNER`
* **URL sau khi đăng nhập:** `http://localhost:8888/owner/dashboard`
* **Menu & Quyền hạn:**
  1. **Executive Dashboard (`/owner/dashboard`):** Tổng quan doanh thu theo ngày/tháng, cơ cấu doanh số dịch vụ & phụ tùng.
  2. **Năng suất nhân sự:** Đánh giá hiệu suất hoàn thành xe của từng Kỹ thuật viên & Cố vấn.
  3. **Báo cáo kinh doanh:** Phân tích tỷ lệ quay lại của khách VIP và lợi nhuận ròng.

---

## 3. LƯU Ý KHI ĐĂNG NHẬP VÀ KIỂM THỬ
1. **Lưu phiên làm việc (Session Persistence):** Token xác thực được lưu an toàn trong `localStorage` (`hihihaha_token` & `hihihaha_user`), giúp phiên làm việc duy trì ổn định khi chuyển trang hoặc F5.
2. **Đăng xuất an toàn:** Tại thanh điều hướng (Navbar) của từng vai trò, bấm nút **Đăng Xuất** để xóa token và quay về trang chủ.
3. **Không dùng chung quyền:** Nếu đăng nhập với vai trò Cố vấn dịch vụ, hệ thống chỉ hiển thị các tính năng của Cố vấn dịch vụ. Tương tự với Quản đốc, Thợ máy và Chủ gara.

---

## 4. THÔNG TIN LIÊN HỆ & TÀI KHOẢN NGÂN HÀNG CHÍNH THỨC
* **Hotline / Zalo hỗ trợ kỹ thuật:** `0797 526 990`
* **Hòm thư điện tử (Email):** `tailoi1606@gmail.com`
* **Trụ sở trung tâm Gara:** `Số 1 Võ Văn Ngân, TP. Thủ Đức, TP. Hồ Chí Minh`
* **Tài khoản thụ hưởng VietQR / Napas247:**
  - Ngân hàng: **MB Bank (Ngân hàng Quân Đội)**
  - Số tài khoản: **0797526990**
  - Tên thụ hưởng: **GARA HIHIHAHA AUTO**

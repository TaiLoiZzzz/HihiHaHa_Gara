# CẨM NANG HƯỚNG DẪN THỰC THI CHI TIẾT TỪNG BƯỚC TOÀN BỘ DỰ ÁN
## HỆ THỐNG QUẢN LÝ TRUNG TÂM DỊCH VỤ & BẢO DƯỠNG Ô TÔ (HIHIHAHA_AUTO)
### KIẾN TRÚC: MODULAR MONOLITH (NODE.JS / EXPRESS.JS & NEXT.JS 14) + ĐA CƠ SỞ DỮ LIỆU POLYGLOT NOSQL

---

# MỤC LỤC LỘ TRÌNH THỰC THI (ROADMAP)
* **GIAI ĐOẠN 1: THIẾT LẬP MÔI TRƯỜNG & KHỞI TẠO HẠ TẦNG (Bước 1 -> Bước 30)**
  * 1.1 Chuẩn bị Công cụ & Phần mềm Cần thiết (Bước 1 - 7)
  * 1.2 Khởi tạo Kho mã nguồn (Git Repository) (Bước 8 - 12)
  * 1.3 Thiết lập Cụm CSDL bằng Docker Compose (Polyglot Infrastructure) (Bước 13 - 23)
  * 1.4 Khởi tạo Khung Dự án Backend (Node.js & Express.js) (Bước 24 - 30)
* **GIAI ĐOẠN 2: THIẾT KẾ & KHỞI TẠO CƠ SỞ DỮ LIỆU MULTI-DBMS (Bước 31 -> Bước 70)**
  * 2.1 CSDL Quan hệ PostgreSQL (Sổ cái Tài chính & Outbox Ledger) (Bước 31 - 40)
  * 2.2 CSDL Document MongoDB (Lõi Vận hành & Sổ Bảo Dưỡng) (Bước 41 - 54)
  * 2.3 CSDL Đồ thị Tri thức Neo4j (Phụ tùng Tương thích Chéo) (Bước 55 - 66)
  * 2.4 CSDL In-Memory Redis (Cache & Lock & Rate Limit) (Bước 67 - 70)
* **GIAI ĐOẠN 3: XÂY DỰNG BACKEND CORE (NODE.JS & EXPRESS.JS) (Bước 71 -> Bước 140)**
  * 3.1 Hạ tầng chung, Utility & Global Middlewares (Bước 71 - 80)
  * 3.2 Phân hệ Xác thực kép Biển số + SĐT & Gửi OTP qua Gmail (UC-01) (Bước 81 - 95)
  * 3.3 Phân hệ Báo giá động & Quản lý Lệnh sửa chữa (UC-02) (Bước 96 - 105)
  * 3.4 Phân hệ Đặt trước kho & Khóa phân tán Redis Redlock (UC-05) (Bước 106 - 115)
  * 3.5 Phân hệ Thanh toán VNPay Sandbox & Transactional Outbox (UC-03) (Bước 116 - 128)
  * 3.6 Phân hệ Outbox Background Worker & Consumer Idempotency (Bước 129 - 134)
  * 3.7 Phân hệ Realtime Socket.io & Điều phối Tiến độ khoang xưởng (UC-04) (Bước 135 - 140)
* **GIAI ĐOẠN 4: XÂY DỰNG GIAO DIỆN FRONTEND (NEXT.JS 14 & TAILWIND CSS) (Bước 141 -> Bước 200)**
  * 4.1 Khởi tạo Dự án Next.js 14 App Router & Base Layout (Bước 141 - 150)
  * 4.2 Portal Khách hàng: Tra cứu Kép & Nhập OTP Gmail (Bước 151 - 160)
  * 4.3 Portal Khách hàng: Chi tiết Báo giá Động & Ký điện tử Phê duyệt (Bước 161 - 170)
  * 4.4 Portal Khách hàng: Màn hình Thanh toán VietQR / VNPay Sandbox (Bước 171 - 180)
  * 4.5 Giao diện Khoang xưởng dành cho Kỹ thuật viên (Tablet Touch-First) (Bước 181 - 190)
  * 4.6 Giao diện Bảng điều phối Kanban & Dashboard Quản lý Gara (Bước 191 - 200)
* **GIAI ĐOẠN 5: KIỂM THỬ TOÀN DIỆN & TỐI ƯU HỆ THỐNG (Bước 201 -> Bước 235)**
  * 5.1 Viết Unit Tests & Integration Tests với Jest/Supertest (Bước 201 - 210)
  * 5.2 Kiểm thử Concurrency & Chống Bán khống với Autocannon / K6 (Bước 211 - 218)
  * 5.3 Kiểm thử Phục hồi Lỗi Outbox Pattern & Giả lập Đứt kết nối CSDL (Bước 219 - 226)
  * 5.4 Kiểm thử End-to-End Luồng Nghiệp vụ từ Tiếp nhận đến Giao xe (Bước 227 - 235)
* **GIAI ĐOẠN 6: ĐÓNG GÓI DOCKER, DEPLOY & CHUẨN BỊ BẢO VỆ ĐỒ ÁN (Bước 236 -> Bước 250)**
  * 6.1 Đóng gói Docker Container & Docker Compose Triển khai Hoàn chỉnh (Bước 236 - 242)
  * 6.2 Kịch bản Demo Live & Chiến lược Trả lời Phản biện Đạt Điểm Tuyệt đối (Bước 243 - 250)

---

# GIAI ĐOẠN 1: THIẾT LẬP MÔI TRƯỜNG & KHỞI TẠO HẠ TẦNG (Bước 1 -> Bước 30)

## 1.1 Chuẩn bị Công cụ & Phần mềm Cần thiết
* **Bước 1:** Kiểm tra phiên bản Node.js trên máy phát triển (Yêu cầu Node.js LTS v18.x hoặc v20.x trở lên): `node -v`.
* **Bước 2:** Kiểm tra trình quản lý gói npm: `npm -v` (khuyến nghị npm v9 trở lên).
* **Bước 3:** Cài đặt Docker Desktop trên Windows/macOS và kích hoạt chế độ WSL2 (để chạy các CSDL bằng container nhẹ nhàng).
* **Bước 4:** Kiểm tra Docker hoạt động: `docker -v` và `docker-compose -v`.
* **Bước 5:** Cài đặt công cụ quản trị GUI cho CSDL:
  * MongoDB Compass (để xem dữ liệu Document MongoDB).
  * pgAdmin 4 hoặc DBeaver (để quản trị PostgreSQL).
  * Neo4j Desktop hoặc sử dụng giao diện web Neo4j Browser tích hợp sẵn.
  * Redis Insight (để trực quan hóa các khóa cache, khóa tồn kho Redlock và TTL).
* **Bước 6:** Cài đặt Postman hoặc Thunder Client (VS Code) để kiểm thử các API RESTful.
* **Bước 7:** Cài đặt Git và cấu hình thông tin định danh: `git config --global user.name "..."`, `git config --global user.email "..."`.

## 1.2 Khởi tạo Kho mã nguồn (Git Repository)
* **Bước 8:** Tạo thư mục gốc dự án: `mkdir hihihaha-auto-project && cd hihihaha-auto-project`.
* **Bước 9:** Khởi tạo Git repository: `git init`.
* **Bước 10:** Tạo file `.gitignore` ở thư mục gốc bỏ qua `node_modules/`, `.env`, `dist/`, `.next/`, `coverage/`.
* **Bước 11:** Tạo hai thư mục phân hệ độc lập:
  * `mkdir backend` (Chứa mã nguồn Node.js Express).
  * `mkdir frontend` (Chứa mã nguồn Next.js 14).
* **Bước 12:** Tạo file `README.md` giới thiệu dự án, kiến trúc Modular Monolith và hướng dẫn khởi chạy.

## 1.3 Thiết lập Cụm CSDL bằng Docker Compose (Polyglot Infrastructure)
* **Bước 13:** Tạo file `docker-compose.yml` ở thư mục gốc dự án.
* **Bước 14:** Cấu hình Service **MongoDB (v7.0)**: Cổng `27017:27017`, volume `mongo_data`, user/password an toàn.
* **Bước 15:** Cấu hình Service **PostgreSQL (v16)**: Cổng `5432:5432`, volume `pg_data`, database `hihihaha_db`.
* **Bước 16:** Cấu hình Service **Neo4j (v5.x)**: Cổng HTTP `7474:7474`, cổng Bolt `7687:7687`, volume `neo4j_data`, tắt auth thử nghiệm hoặc đặt pass `neo4j123456`.
* **Bước 17:** Cấu hình Service **Redis (v7.2)**: Cổng `6379:6379`, volume `redis_data`, kích hoạt chế độ Append Only File (`appendonly yes`).
* **Bước 18:** Chạy lệnh khởi động toàn bộ cụm CSDL nền tảng: `docker-compose up -d`.
* **Bước 19:** Kiểm tra trạng thái hoạt động của 4 container: `docker ps`. Đảm bảo cả 4 container đều ở trạng thái `Up (healthy)`.
* **Bước 20:** Dùng MongoDB Compass kết nối tới `mongodb://localhost:27017` để kiểm tra kết nối.
* **Bước 21:** Dùng DBeaver/pgAdmin kết nối tới `postgresql://localhost:5432/hihihaha_db` kiểm tra kết nối.
* **Bước 22:** Mở trình duyệt truy cập `http://localhost:7474` để kiểm tra Neo4j Browser.
* **Bước 23:** Dùng Redis CLI hoặc Redis Insight kết nối tới `localhost:6379` chạy lệnh `PING` (nhận `PONG`).

## 1.4 Khởi tạo Khung Dự án Backend (Node.js & Express.js)
* **Bước 24:** Di chuyển vào thư mục backend: `cd backend`.
* **Bước 25:** Khởi tạo file `package.json`: `npm init -y`.
* **Bước 26:** Cài đặt các thư viện lõi HTTP: `npm install express cors dotenv helmet morgan`.
* **Bước 27:** Cài đặt các thư viện CSDL: `npm install mongoose pg neo4j-driver ioredis`.
* **Bước 28:** Cài đặt thư viện bảo mật và tiện ích: `npm install jsonwebtoken bcrypt nodemailer crypto-js socket.io`.
* **Bước 29:** Cài đặt công cụ phát triển: `npm install --save-dev nodemon jest supertest`.
* **Bước 30:** Cấu hình file `package.json` với script `"dev": "nodemon src/server.js"`, `"start": "node src/server.js"`.

---

# GIAI ĐOẠN 2: THIẾT KẾ & KHỞI TẠO CƠ SỞ DỮ LIỆU MULTI-DBMS (Bước 31 -> Bước 70)

## 2.1 CSDL Quan hệ PostgreSQL (Sổ cái Tài chính & Outbox Ledger)
* **Bước 31:** Tạo file migration hoặc script SQL `src/config/scripts/init_postgres.sql`.
* **Bước 32:** Bật tiện ích mở rộng UUID: `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`.
* **Bước 33:** Tạo bảng `payment_transactions` lưu vết giao dịch VNPay (các cột: `txn_id`, `order_code`, `vnp_txn_ref`, `amount`, `status`, `payment_link_expires_at`, `created_at`, `completed_at`).
* **Bước 34:** Thêm ràng buộc toàn vẹn cho `amount > 0` và `status IN ('PENDING', 'SUCCESS', 'FAILED', 'PAYMENT_EXPIRED')`.
* **Bước 35:** Tạo bảng `outbox_events` phục vụ Transactional Outbox Pattern (`event_id`, `aggregate_type`, `aggregate_id`, `event_type`, `payload`, `processed_status`, `retry_count`, `created_at`, `processed_at`).
* **Bước 36:** Tạo Partial Index cho bảng outbox: `CREATE INDEX idx_outbox_pending ON outbox_events(processed_status) WHERE processed_status = 'PENDING';`.
* **Bước 37:** Tạo bảng `invoices` lưu trữ thông tin hóa đơn tài chính VAT điện tử.
* **Bước 38:** Chạy script tạo bảng trên PostgreSQL: `psql -h localhost -U postgres -d hihihaha_db -f src/config/scripts/init_postgres.sql`.
* **Bước 39:** Viết module kết nối PostgreSQL pool trong backend: `src/config/postgres.js` sử dụng thư viện `pg.Pool`.
* **Bước 40:** Viết hàm kiểm tra kết nối PostgreSQL khi ứng dụng khởi động (healthcheck).

## 2.2 CSDL Document MongoDB (Lõi Vận hành & Sổ Bảo Dưỡng)
* **Bước 41:** Viết module kết nối Mongoose trong `src/config/mongo.js`.
* **Bước 42:** Tạo Mongoose Schema `CustomerSchema` trong `src/modules/auth/models/customer.model.js`: Áp dụng Extended Reference Pattern, nhúng mảng tóm tắt `vehicles_owned` (`{ license_plate, model_name, vin }`) giúp tối ưu truy vấn 1-query hiển thị ngay giao diện mà không cần JOIN; lưu họ tên, số điện thoại (`unique`, `index`), email, tổng chi tiêu `total_spent`, phân hạng VIP, và mảng `audit_logs`.
* **Bước 43:** Tạo Mongoose Schema `VehicleSchema` trong `src/modules/vehicle/models/vehicle.model.js`: Lưu số khung `vin` (Unique Index), `license_plate` (Index), `model_name`, `manufacture_year`, `current_odo`, `current_owner_phone` (tham chiếu khách hàng), và mảng `service_history` (sổ bảo dưỡng trọn đời gắn liền với chiếc xe khi đổi chủ). Thiết kế phương thức dịch vụ `transferVehicleOwnershipService` sử dụng Mongoose Session Transaction để tự động đồng bộ nguyên tử (Atomic Transfer) cập nhật biển số mới và chuyển nhượng xe giữa hai Document `Vehicle` và `Customer`.
* **Bước 44:** Tạo Mongoose Schema `InventoryItemSchema` trong `src/modules/inventory/models/inventory.model.js`:
  * Lưu `part_code` (Unique Index), `part_name`, `category`, `unit` (Bộ/Chiếc/Lít), `cost_price` (giá vốn nhập), `retail_price` (giá bán lẻ).
  * Lưu `stock_quantity` (tồn kho vật lý hiện tại), `min_threshold` (ngưỡng tối thiểu cảnh báo).
  * Lưu `location_rack` (vị trí kệ kho, ví dụ: KỆ-A1-03).
  * Lưu `is_active` (boolean, mặc định true - dùng cho cơ chế Soft Delete ngừng kinh doanh).
  * Nhúng mảng `adjustment_history`: Lưu vết lịch sử các lần kiểm kê định kỳ đầu tháng / điều chỉnh đột xuất (`voucher_code`, `adjusted_at`, `adjusted_by`, `previous_quantity`, `new_quantity`, `variance`, `reason_category`, `note`).
* **Bước 45:** Thiết lập Compound Text Index trên MongoDB cho kho phụ tùng: `InventoryItemSchema.index({ part_name: "text", part_code: "text" });` (Thay thế hoàn toàn Elasticsearch, search siêu tốc dưới 15ms).
* **Bước 46:** Tạo Mongoose Schema `WorkOrderSchema` trong `src/modules/work-order/models/work-order.model.js`:
  * Lưu `order_code` (Unique Index).
  * Lưu `license_plate` (Index).
  * Lưu `current_status` (Enum State Machine).
  * Nhúng (Embed) Document con `estimate`: Lưu `subtotal_labor`, `subtotal_parts`, `pretax_amount`, `vat_amount`, `total_amount`, mảng `items`.
  * Nhúng mảng `inspection_photos` (lưu URL ảnh linh kiện cũ/mới nghiệm thu).
  * Nhúng mảng `workflow_timeline` (lưu vết thời gian ai đổi trạng thái nào).
* **Bước 47:** Thiết lập Compound Index trên MongoDB: `WorkOrderSchema.index({ license_plate: 1, current_status: 1 });` để tối ưu hóa truy vấn tra cứu của khách hàng.
* **Bước 48:** Viết script Seeding dữ liệu mẫu: `src/config/scripts/seed_mongo.js`.
* **Bước 49:** Nạp hồ sơ khách hàng mẫu: Chị Minh Thảo (`minhthao@gmail.com`, `0912.345.678`).
* **Bước 50:** Nạp hồ sơ xe mẫu: Toyota Camry 2.5Q, Biển số `51K-888.88`, VIN `VN1234567890CAMRY`.
* **Bước 51:** Nạp danh mục kho phụ tùng (50 linh kiện phổ biến: má phanh Camry, má phanh Lexus, lọc dầu, lọc gió, gạt mưa silicon, bugi Iridium...).
* **Bước 52:** Nạp Lệnh sửa chữa mẫu `WO-20261001-0089` với đúng các hạng mục:
  * Công thay má phanh: 450.000 đ
  * Bộ má phanh Camry `04465-06100`: 1.850.000 đ
  * Gạt mưa silicon: 350.000 đ
  * Vệ sinh họng nạp: 300.000 đ
* **Bước 53:** Chạy script seed Mongo: `node src/config/scripts/seed_mongo.js`.
* **Bước 54:** Dùng MongoDB Compass kiểm tra dữ liệu đã nạp đầy đủ vào các collections.

## 2.3 CSDL Đồ thị Tri thức Neo4j (Phụ tùng Tương thích Chéo)
* **Bước 55:** Viết module kết nối Neo4j Driver trong `src/config/neo4j.js` bằng giao thức Bolt (`bolt://localhost:7687`).
* **Bước 56:** Tạo script Cypher khởi tạo ràng buộc duy nhất:
  * `CREATE CONSTRAINT FOR (p:Part) REQUIRE p.code IS UNIQUE;`
  * `CREATE CONSTRAINT FOR (v:VehicleModel) REQUIRE v.name IS UNIQUE;`
* **Bước 57:** Nạp Node Khung gầm chia sẻ: `CREATE (p:Platform {code: "TNGA-K", manufacturer: "Toyota Group"});`.
* **Bước 58:** Nạp Node Động cơ: `CREATE (e:Engine {code: "2AR-FE", displacement: "2.5L"});`.
* **Bước 59:** Nạp Node Dòng xe: `CREATE (:VehicleModel {name: "Toyota Camry 2.5Q"}), (:VehicleModel {name: "Lexus ES250"});`.
* **Bước 60:** Tạo quan hệ dòng xe dùng chung khung gầm: `[:USES_PLATFORM]` tới Platform `TNGA-K`.
* **Bước 61:** Nạp Node Cụm chi tiết: `CREATE (:Subsystem {name: "Front Caliper Assembly", category: "Brake"});`.
* **Bước 62:** Nạp Node Phụ tùng: Mã `04465-06100` (Camry) và `04465-33480` (Lexus).
* **Bước 63:** Thiết lập quan hệ lắp ráp: `(:Part)-[:FITS_SUB_ASSEMBLY]->(:Subsystem)-[:MOUNTED_ON_PLATFORM]->(:Platform)`.
* **Bước 64:** Viết file script `src/config/scripts/seed_neo4j.js` thực thi toàn bộ câu lệnh Cypher.
* **Bước 65:** Chạy `node src/config/scripts/seed_neo4j.js`.
* **Bước 66:** Mở Neo4j Browser chạy thử câu truy vấn Cypher tra cứu đồ thị tương thích $N$-hops để kiểm tra kết quả trả về mã má phanh Camry cho xe Lexus.

## 2.4 CSDL In-Memory Redis (Cache & Lock & Rate Limit)
* **Bước 67:** Viết module kết nối Redis client bằng thư viện `ioredis` trong `src/config/redis.js`.
* **Bước 68:** Định nghĩa chuẩn quy tắc đặt tên tiền tố khóa (Key Naming Convention):
  * `ratelimit:email_cooldown:{email}`: TTL 60s
  * `ratelimit:daily_email:{email}`: TTL 86400s (24h)
  * `lock:alloc:part:{part_code}`: TTL 5s (Redlock Mutex phân tán cấp phát kho khi duyệt báo giá)
  * `lock:payment:{order_code}`: TTL 600s (Khóa Idempotent phiên thanh toán VNPay 10 phút)
* **Bước 69:** Viết hàm test ghi và đọc key Redis có TTL: `redis.set('test_key', 'val', 'EX', 10)`.
* **Bước 70:** Đóng gói toàn bộ các hàm cấu hình kết nối thành file khởi động tổng hợp `src/config/index.js`.

# GIAI ĐOẠN 3: XÂY DỰNG BACKEND CORE (NODE.JS & EXPRESS.JS) (Bước 71 -> Bước 140)

## 3.1 Hạ tầng chung, Tiện ích & Global Middlewares (Bước 71 -> Bước 80)
* **Bước 71: Thiết lập cấu trúc thư mục Clean Architecture**:
  Tạo cấu trúc cây thư mục bên trong `backend/src/`:
  ```
  backend/src/
  ├── config/          # Kết nối CSDL (Mongo, PG, Neo4j, Redis, Redlock)
  ├── middlewares/     # JWT Auth, Rate Limiter, Error Handler, Request Validator
  ├── modules/         # Các phân hệ nghiệp vụ độc lập
  │   ├── auth/        # Xác thực kép Biển số + SĐT, OTP Gmail
  │   ├── customer/    # Hồ sơ khách hàng, sổ bảo dưỡng số
  │   ├── vehicle/     # Quản lý thông tin xe, tra cứu lịch sử sửa chữa
  │   ├── inventory/   # Kho phụ tùng, kiểm tra tồn kho, Text Index
  │   ├── work-order/  # Báo giá, Lệnh sửa chữa, State Machine
  │   ├── payment/     # VNPay Sandbox, Sổ cái PG, VietQR
  │   └── neo4j-graph/ # Tra cứu tương thích phụ tùng chéo N-hops
  ├── sockets/         # Quản lý sự kiện WebSocket Realtime (Socket.io)
  ├── workers/         # Tiến trình nền Outbox Polling Worker
  ├── utils/           # Helper băm mật mã, định dạng tiền tệ, logger
  ├── routes.js        # Tổng hợp định tuyến toàn hệ thống
  └── server.js        # File khởi động máy chủ HTTP & Socket.io
  ```
* **Bước 72: Cấu hình biến môi trường toàn diện trong `backend/.env`**:
  Thiết lập các tham số vận hành:
  ```env
  PORT=5000
  NODE_ENV=development
  JWT_SECRET=HIHIHAHA_SUPER_SECRET_KEY_2026
  JWT_EXPIRES_IN=2h
  REFRESH_TOKEN_EXPIRES_IN=7d

  # Multi-DBMS Connections
  MONGO_URI=mongodb://localhost:27017/hihihaha_db
  PG_HOST=localhost
  PG_PORT=5432
  PG_USER=postgres
  PG_PASSWORD=postgres
  PG_DATABASE=hihihaha_db
  NEO4J_URI=bolt://localhost:7687
  NEO4J_USER=neo4j
  NEO4J_PASSWORD=neo4j123456
  REDIS_HOST=localhost
  REDIS_PORT=6379

  # Gmail SMTP App Password (Thay thế SMS, hoàn toàn miễn phí, hợp pháp)
  GMAIL_USER=hihihaha.auto.service@gmail.com
  GMAIL_APP_PASSWORD=abcd1234efgh5678

  # VNPay Sandbox Test Credentials
  VNP_TMN_CODE=TESTTMN01
  VNP_HASH_SECRET=SECRETSECRET1234567890
  VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
  VNP_RETURN_URL=http://localhost:3000/customer/payment-result
  ```
* **Bước 73: Xây dựng Module Logger chuẩn `src/utils/logger.js`**:
  Sử dụng thư viện Winston kết hợp Morgan để ghi nhật ký chi tiết các yêu cầu HTTP, thời gian phản hồi (response time), lỗi ngoại lệ vào file xoay vòng `logs/app.log`.
* **Bước 74: Xây dựng Global Error Handling Middleware `src/middlewares/errorHandler.js`**:
  Bắt tập trung mọi lỗi `AppError`, `CastError`, `ValidationError` và lỗi CSDL, trả về JSON chuẩn đồng nhất:
  `{ success: false, statusCode: 500, message: "Lỗi nội bộ hệ thống", errorCode: "INTERNAL_SERVER_ERROR" }`.
* **Bước 75: Xây dựng Module Response Formatter `src/utils/response.js`**:
  Viết hai hàm tiện ích chuẩn hóa API output: `sendSuccess(res, data, message, statusCode = 200)` và `sendError(res, message, statusCode = 400, details = null)`.
* **Bước 76: Cấu hình CORS an toàn trong `src/app.js`**:
  Cho phép Client từ domain Next.js `http://localhost:3000` truy cập, bật `credentials: true`, hỗ trợ đầy đủ các phương thức `GET, POST, PUT, PATCH, DELETE`.
* **Bước 77: Kích hoạt Helmet Middleware bảo mật HTTP Headers**:
  Bật Helmet để tự động thêm các trường bảo vệ XSS, CSP, HSTS, phòng chống clickjacking và giả mạo iframe.
* **Bước 78: Cấu hình Body Parser phân giải payload JSON**:
  Kích hoạt `express.json({ limit: "10mb" })` (cho phép tải ảnh giám định khoang xưởng dưới dạng base64 nếu cần) và `express.urlencoded({ extended: true })`.
* **Bước 79: Xây dựng Middleware Bảo mật Đa tầng (JWT Auth, RBAC & ABAC Ngữ cảnh)**:
  * Viết `src/middlewares/authJwt.js`: Giải mã Bearer JWT token, gán `req.user` (`userId`, `role`, `license_plate`) vào request; kiểm tra ma trận phân quyền 6 Roles: `CUSTOMER`, `SERVICE_ADVISOR`, `WORKSHOP_MANAGER`, `TECHNICIAN`, `WAREHOUSE_KEEPER`, `OWNER`.
  * Viết Middleware kiểm tra sở hữu tài nguyên ABAC `src/middlewares/checkTechnicianAssignment.js`: Kiểm tra nếu là Thợ (`TECHNICIAN`) gọi API thao tác trên xe thì bắt buộc `userId` phải nằm trong mảng `workOrder.assigned_technicians`. Nếu không, lập tức chặn đứng với mã lỗi `403 FORBIDDEN - Bạn không được Quản đốc phân công xe này` (chống thợ làm bậy chéo xe nhau).
* **Bước 80: Khởi tạo Bộ điều phối Route chính `src/routes.js`**:
  Đăng ký toàn bộ các endpoint theo tiền tố chuẩn RESTful: `/api/v1/auth`, `/api/v1/vehicles`, `/api/v1/work-orders`, `/api/v1/payments`, `/api/v1/inventory`, `/api/v1/parts-graph`.

---

## 3.2 Phân hệ Xác thực kép Biển số + SĐT & Gửi OTP qua Gmail (UC-01) (Bước 81 -> Bước 95)
* **Bước 81: Cài đặt và cấu hình Nodemailer Transport `src/modules/auth/services/email.service.js`**:
  Sử dụng `nodemailer.createTransport` kết nối cổng `465` (SSL) với Gmail App Password của hệ thống HIHIHAHA_AUTO.
* **Bước 82: Thiết kế mẫu HTML Email gửi mã OTP bảo mật**:
  Tạo giao diện email responsive hiện đại: Logo HIHIHAHA_AUTO, hộp mã OTP 6 số màu xanh nổi bật, cảnh báo thời hạn 5 phút, lưu ý nhân viên gara không bao giờ hỏi mã OTP này.
* **Bước 83: Xây dựng hàm sinh mã OTP ngẫu nhiên an toàn**:
  Dùng thư viện mã hóa `crypto.randomInt(100000, 999999)` trong `src/utils/crypto.js` để đảm bảo phân phối ngẫu nhiên bảo mật, chống đoán trước.
* **Bước 84: Xây dựng Redis Rate Limiter Middleware `src/middlewares/otpRateLimiter.js`**:
  Kiểm tra hai tầng bảo vệ chống cạn kiệt tài nguyên gửi thư:
  * **Cooldown 60s**: `await redis.get("ratelimit:email_cooldown:" + email)`. Nếu tồn tại, chặn ngay với thông báo "Vui lòng đợi 60 giây trước khi yêu cầu mã mới".
  * **Giới hạn 5 lần/ngày**: Dùng lệnh Redis `current = await redis.incr("ratelimit:daily_email:" + email)`. Nếu `current == 1` thì đặt TTL 86400s. Nếu `current > 5`, trả mã lỗi 429 Too Many Requests.
* **Bước 85: Xây dựng Controller Yêu cầu gửi OTP `requestOtpController`**:
  Tiếp nhận đầu vào `license_plate` (chuẩn hóa viết hoa, loại bỏ dấu cách thừa) và `phone_number`.
* **Bước 86: Truy vấn đối soát kép trên MongoDB Collection `customers`**:
  Thực thi truy vấn:
  ```javascript
  const customer = await Customer.findOne({
    phone: phone_number,
    "vehicles_owned.license_plate": license_plate
  });
  ```
* **Bước 87: Xử lý ngoại lệ đối soát không khớp**:
  Nếu không tìm thấy, kiểm tra xem biển số xe có tồn tại trong hệ thống hay không:
  * Nếu biển số có thật nhưng số điện thoại không khớp: Trả lỗi `403 FORBIDDEN - Số điện thoại không trùng khớp với chủ phương tiện đăng ký`.
  * Nếu không có biển số trong hệ thống: Trả lỗi `404 NOT_FOUND - Xe chưa từng làm dịch vụ tại trung tâm`.
* **Bước 88: Băm mã OTP và lưu vào Redis**:
  Tạo chuỗi hash SHA256 của mã OTP 6 số, lưu vào key `otp:login:${license_plate}` với thời gian sống TTL 300 giây (5 phút).
* **Bước 89: Gửi Email OTP bất đồng bộ**:
  Gọi `emailService.sendOtpEmail(customer.email, otpCode)` bằng Promise bất đồng bộ, không bắt HTTP Request phải chờ đợi (Fast Response).
* **Bước 90: Phản hồi thông tin bảo mật cho Client**:
  Trả về status 200 kèm email đã được che giấu (Masked Email): Ví dụ `m***o@gmail.com` để người dùng kiểm tra hòm thư.
* **Bước 91: Xây dựng Controller Xác thực OTP `verifyOtpController`**:
  Tiếp nhận `license_plate`, `phone_number`, `otp_code`.
* **Bước 92: Đối soát mã OTP trong Redis In-Memory**:
  Lấy giá trị băm từ key `otp:login:${license_plate}`, băm mã người dùng gửi lên để so sánh.
  * Nếu không tồn tại: Báo lỗi "Mã OTP đã hết hạn hoặc không tồn tại".
  * Nếu không khớp: Tăng biến đếm thử sai `otp:attempts:${license_plate}`. Nếu quá 3 lần, xóa bỏ mã OTP ngay lập tức để chống Brute-force.
* **Bước 93: Khởi tạo Cặp JSON Web Token (JWT)**:
  Khi OTP chính xác, xóa key OTP khỏi Redis. Ký `accessToken` (hạn 2h) chứa `customerId`, `license_plate`, `role: 'CUSTOMER'` và `refreshToken` (hạn 7 ngày).
* **Bước 94: Lưu vết lịch sử đăng nhập vào MongoDB**:
  Ghi vào mảng `customer.audit_logs`: `{ action: "LOGIN_OTP_SUCCESS", ip: req.ip, user_agent: req.headers["user-agent"], timestamp: new Date() }`.
* **Bước 95: Kiểm thử hoàn chỉnh API Xác thực kép qua Postman**:
  Gửi request kiểm tra các case: Đúng biển + đúng SĐT; Đúng biển + sai SĐT; Spam OTP liên tục; Nhập sai OTP 3 lần.

---

## 3.3 Phân hệ Báo giá động & Quản lý Lệnh sửa chữa (UC-02) (Bước 96 -> Bước 105)
* **Bước 96: Xây dựng Controller Khởi tạo Lệnh sửa chữa `createWorkOrderController`**:
  Cố vấn dịch vụ tiếp nhận xe, tạo mã Lệnh sửa chữa tự động theo cú pháp ngày: `WO-YYYYMMDD-XXXX` (sử dụng MongoDB sequence hoặc nanoid).
* **Bước 97: Xây dựng Service Tính toán Báo giá Động `calculateEstimateService`**:
  Duyệt qua danh sách các hạng mục kiểm tra ban đầu:
  * Nhóm Tiền công: Tính tổng `subtotal_labor = SUM(labor_cost)`.
  * Nhóm Phụ tùng: Tính `subtotal_parts = SUM(quantity * unit_price)`.
  * Tổng trước thuế: `pretax_amount = subtotal_labor + subtotal_parts`.
  * Thuế VAT (8% theo quy định): `vat_amount = Math.round(pretax_amount * 0.08)`.
  * Tổng thanh toán cuối cùng: `total_amount = pretax_amount + vat_amount`.
* **Bước 98: Kiểm chứng tính nhất quán toán học với bộ dữ liệu chuẩn SRS**:
  Đảm bảo với ví dụ mẫu (Thay má phanh + Lọc gió + Gạt mưa + Vệ sinh họng nạp): Tổng trước thuế đúng 2.600.000 đ, VAT 8% là 208.000 đ, Tổng cộng đúng 2.808.000 đ.
* **Bước 99: Lưu trữ Báo giá nhúng (Embedded) vào WorkOrder MongoDB**:
  Lưu toàn bộ chi tiết báo giá vào trường `estimate` của tài liệu WorkOrder, đặt `approval_status = "PENDING_CUSTOMER"`, `current_status = "QUOTE_SENT"`.
* **Bước 100: Xây dựng API Tra cứu Chi tiết Lệnh sửa chữa `getWorkOrderDetailController`**:
  Endpoint `GET /api/v1/work-orders/:order_code`. Tích hợp middleware kiểm tra quyền: Khách hàng chỉ được xem lệnh của đúng biển số xe sở hữu.
* **Bước 101: Thiết kế Máy trạng thái Hợp lệ (State Machine Guard)**:
  Tạo map kiểm tra chuyển đổi trạng thái nghiêm ngặt:
  `DRAFT` -> `INSPECTION` -> `QUOTE_SENT` -> `QUOTE_APPROVED` -> `WAITING_PARTS` -> `IN_PROGRESS` -> `QUALITY_CHECK` -> `PAYMENT_PENDING` -> `PAID` -> `DELIVERED`.
  Từ chối bất kỳ bước chuyển dịch trạng thái nào vi phạm quy trình gara.
* **Bước 102: Xây dựng Controller Khách hàng Phê duyệt Báo giá `customerApproveEstimateController`**:
  Tiếp nhận `approved_items` (khách có quyền tích chọn làm từng mục hoặc toàn bộ), chữ ký số hoặc xác nhận đồng ý từ cổng thông tin khách hàng.
* **Bước 103: Cập nhật Trạng thái Phê duyệt trong MongoDB**:
  Cập nhật `estimate.approval_status = "APPROVED"`, `estimate.approved_at = new Date()`, chuyển `current_status = "QUOTE_APPROVED"`.
* **Bước 104: Tự động Kích hoạt Yêu cầu Đặt trước Phụ tùng**:
  Gọi trực tiếp sang Module Kho `reservePartsService` để khóa giữ các linh kiện đã được khách hàng chấp thuận thay thế.
* **Bước 105: Phát tín hiệu Realtime qua WebSocket**:
  Bắn sự kiện `QUOTE_APPROVED_EVENT` tới phòng làm việc của Quản đốc xưởng (`room:advisors`) để in phiếu xuất kho và phân công khoang kỹ thuật.

---

## 3.4 Phân hệ Đặt trước kho & Khóa phân tán Redis Redlock (UC-05) (Bước 106 -> Bước 115)
* **Bước 106: Cài đặt và cấu hình thư viện `redlock` trong `src/config/redlock.js`**:
  Khởi tạo instance Redlock kết nối tới Redis Client với cấu hình: `driftFactor: 0.01`, `retryCount: 3`, `retryDelay: 200ms`, `retryJitter: 50ms`.
* **Bước 107: Xây dựng Bộ API Quản lý Kho, CRUD Danh mục & Phiếu Kiểm kê Đầu tháng**:
  * Viết các Controller trong `src/modules/inventory/controllers/inventory.controller.js`:
    - `createPartController`: Thêm mới phụ tùng vào danh mục kho kèm vị trí kệ.
    - `updatePartController`: Chỉnh sửa thông tin, giá bán lẻ khi thị trường biến động.
    - `deletePartController`: Xóa mềm (`is_active: false`) để bảo toàn dữ liệu lịch sử các Lệnh sửa chữa cũ.
    - `createStockAdjustmentController`: Lập **Phiếu kiểm kê & điều chỉnh tồn kho định kỳ** (`ST-YYYYMMDD-XX`), tiếp nhận số lượng thực tế đếm được ($Q_{actual}$), tự động tính độ lệch $\Delta$, lưu vết kiểm toán vào `adjustment_history`, cập nhật lại `stock_quantity` trong MongoDB và đồng bộ Redis.
  * Xây dựng Service Cấp phát Phụ tùng theo Lệnh `allocatePartsService(order_code, items)`: Thực hiện duyệt an toàn từng mã linh kiện bằng khóa phân tán Redis Redlock khi khách hàng Ký duyệt Báo giá (`APPROVED`).
* **Bước 108: Cơ chế Khóa Phân tán Cạnh tranh Cấp phát (Redlock Mutex per Part)**:
  Đối với mỗi `part_code`, xin cấp khóa: `const lock = await redlock.acquire(["lock:alloc:part:" + part_code], 5000)`.
  Điều này ngăn chặn triệt để hiện tượng 2 cố vấn / khách hàng cùng cấp phát linh kiện duy nhất còn lại trong kho cùng một mili-giây.
* **Bước 109: Đối soát tồn kho khả dụng bên trong khối Khóa an toàn**:
  * Đọc tồn kho vật lý $Q_{stock}$ và số lượng đã cấp phát $Q_{alloc}$ từ MongoDB Collection `inventory_items`.
  * Tồn kho khả dụng: $Q_{avail} = Q_{stock} - Q_{alloc}$.
* **Bước 110: Xử lý Kịch bản Tồn kho Không Đủ**:
  Nếu $Q_{avail} < Q_{req}$, hủy bỏ tiến trình cấp phát cho lệnh này, nhả toàn bộ các khóa đã nhận, và ném lỗi `INSUFFICIENT_STOCK_ERROR`.
* **Bước 111: Cập nhật Cấp phát Phụ tùng trên MongoDB & Điều phối Khoang sửa chữa**:
  Nếu đủ hàng:
  * Thực hiện cập nhật nguyên tử trên MongoDB: `await InventoryItem.updateOne({ part_code }, { $inc: { allocated_quantity: req_qty } })`.
  * Xuất phiếu điều phối vật tư, chuyển phụ tùng từ kho vật lý ra khoang cầu nâng cho kỹ thuật viên tiến hành lắp ráp thi công.
* **Bước 112: Giải phóng khóa Redlock trong khối `finally`**:
  Đảm bảo luôn luôn giải phóng khóa dù có lỗi xảy ra: `await lock.release()`.
* **Bước 113: Xây dựng Cơ chế Hoàn trả Kho khi Hủy Lệnh (`deallocatePartsService`)**:
  Viết Service `deallocatePartsService(order_code)`:
  Khi khách hủy lệnh sửa chữa (`CANCELLED`), hệ thống tự động hoàn lại số lượng đã cấp phát: giảm `allocated_quantity` trong MongoDB và thu hồi phụ tùng vật lý về kệ kho an toàn.
* **Bước 114: Xây dựng Khóa Phân tán Phiên Thanh toán Idempotent (10 phút)**:
  Viết Service `createPaymentSessionLock(order_code)` trên Redis:
  `await redis.set("lock:payment:" + order_code, "ACTIVE", "NX", "EX", 600)`.
  Đảm bảo khách hàng không bị trừ tiền 2 lần khi bấm thanh toán liên tục hoặc khi 2 người cùng quét một mã VietQR động.
* **Bước 115: Kiểm thử mô phỏng Đua lệnh Cấp phát kho (Race Condition Simulation)**:
  Dùng Promise.all bắn 20 requests đồng thời cấp phát 1 bộ má phanh cuối cùng, kiểm tra chỉ duy nhất 1 lệnh thành công, 19 lệnh còn lại nhận thông báo hết hàng chuẩn xác.

---

## 3.5 Phân hệ Thanh toán VNPay Sandbox & Transactional Outbox (UC-03) (Bước 116 -> Bước 128)
* **Bước 116: Xây dựng Tiện ích Ký mã hóa VNPay `src/modules/payment/utils/vnpay.js`**:
  Triển khai thuật toán sắp xếp thứ tự từ điển (alphabetical sort) các tham số theo đúng chuẩn tài liệu kỹ thuật VNPay, kết chuỗi và băm HMAC-SHA512.
* **Bước 117: Xây dựng Controller Khởi tạo Giao dịch Thanh toán `createPaymentUrlController`**:
  Tiếp nhận `order_code`. Lấy thông tin Lệnh sửa chữa từ MongoDB, kiểm tra số tiền cần thanh toán `total_amount`.
* **Bước 118: Áp dụng Thời hạn VietQR & Khóa Idempotency 10 Phút**:
  Thiết lập tham số `vnp_ExpireDate` đúng bằng thời điểm hiện tại cộng thêm 10 phút:
  `const vnp_ExpireDate = moment().add(10, 'minutes').format('YYYYMMDDHHmmss')`.
  *Ý nghĩa*: Đồng bộ hoàn hảo với Redis Idempotent Lock 600s, sau 10 phút link hết hạn nếu chưa thanh toán sẽ giải phóng phiên an toàn mà không ảnh hưởng tới lệnh sửa chữa đã hoàn thành.
* **Bước 119: Tạo bản ghi Giao dịch ban đầu trên PostgreSQL**:
  Mở kết nối tới PostgreSQL Pool, chèn bản ghi vào bảng `payment_transactions`:
  ```sql
  INSERT INTO payment_transactions (order_code, vnp_txn_ref, amount, status, payment_link_expires_at)
  VALUES ($1, $2, $3, 'PENDING', NOW() + INTERVAL '10 minutes');
  ```
* **Bước 120: Trả về URL Thanh toán VNPay cho Frontend**:
  Trả về URL chuyển hướng dạng `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=...&vnp_SecureHash=...` để khách quét VietQR hoặc thanh toán ATM/Thẻ quốc tế.
* **Bước 121: Xây dựng Controller Tiếp nhận IPN Webhook từ VNPay `vnpayIpnController`**:
  Endpoint `GET /api/v1/payments/vnpay_ipn`. Đây là kênh giao tiếp ngầm Server-to-Server cực kỳ quan trọng.
* **Bước 122: Xác thực Tính Toàn vẹn Chữ ký Checksum (Checksum Validation)**:
  Tách trường `vnp_SecureHash`, sắp xếp các trường còn lại và tính toán hash HMAC-SHA512 với `VNP_HASH_SECRET`.
  Nếu hash tính lại khác hash VNPay gửi sang: Trả ngay `{ RspCode: '97', Message: 'Checksum failed' }`.
* **Bước 123: Kiểm tra Trạng thái Giao dịch trong PostgreSQL**:
  Truy vấn `SELECT * FROM payment_transactions WHERE vnp_txn_ref = $1;`.
  * Nếu không tìm thấy: Trả `{ RspCode: '01', Message: 'Order not found' }`.
  * Nếu đã ở trạng thái `SUCCESS`: Trả `{ RspCode: '02', Message: 'Order already confirmed' }` (Bảo vệ Idempotent tầng Webhook).
* **Bước 124: Kiểm tra Khớp số tiền thanh toán (Amount Verification)**:
  So sánh `parseInt(vnp_Amount) / 100` với `amount` lưu trong cơ sở dữ liệu. Nếu chênh lệch: Trả `{ RspCode: '04', Message: 'Invalid amount' }`.
* **Bước 125: Bắt đầu PostgreSQL Transaction đảm bảo tính ACID**:
  Thực thi `const client = await pgPool.connect(); await client.query('BEGIN');`.
* **Bước 126: Cập nhật Trạng thái Giao dịch PostgreSQL**:
  Nếu `vnp_ResponseCode === '00'` (Thành công):
  `UPDATE payment_transactions SET status = 'SUCCESS', vnp_bank_code = $1, completed_at = NOW() WHERE vnp_txn_ref = $2;`.
* **Bước 127: Ghi Sự kiện vào Bảng `outbox_events` trong CÙNG Transaction**:
  ```sql
  INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload, processed_status)
  VALUES ('WORK_ORDER', $1, 'PAYMENT_COMPLETED', $2, 'PENDING');
  ```
  *(Giải quyết triệt để vấn đề Dual-Write: Nếu máy chủ sập nguồn lúc này, cả giao dịch tiền và sự kiện outbox cùng được rollback hoặc cùng được commit)*.
* **Bước 128: Commit Transaction và Phản hồi VNPay**:
  Thực thi `await client.query('COMMIT'); client.release();` và trả về `{ RspCode: '00', Message: 'Confirm Success' }`.

---

## 3.6 Phân hệ Outbox Background Worker & Consumer Idempotency (Bước 129 -> Bước 134)
* **Bước 129: Xây dựng Tiến trình Polling Worker `src/workers/outbox.worker.js`**:
  Viết vòng lặp bất đồng bộ định kỳ quét bảng outbox mỗi 2000ms:
  ```javascript
  setInterval(async () => { await processOutboxEvents(); }, 2000);
  ```
* **Bước 130: Truy vấn Sự kiện Chờ xử lý An toàn Đa tiến trình (Concurrency Safe)**:
  Sử dụng cú pháp khóa hàng tránh đụng độ giữa nhiều instance worker:
  ```sql
  SELECT * FROM outbox_events
  WHERE processed_status = 'PENDING'
  ORDER BY created_at ASC
  LIMIT 20
  FOR UPDATE SKIP LOCKED;
  ```
* **Bước 131: Triển khai Idempotent Consumer trên MongoDB (Khử Trùng lặp Tuyệt đối)**:
  Khi đọc được sự kiện `PAYMENT_COMPLETED`, thực thi câu lệnh cập nhật có điều kiện:
  ```javascript
  const updateResult = await WorkOrder.updateOne(
    {
      order_code: payload.order_code,
      payment_status: { $ne: "PAID" }  // ĐIỀU KIỆN CHỐNG CHẠY 2 LẦN
    },
    {
      $set: {
        payment_status: "PAID",
        current_status: "PAYMENT_CONFIRMED",
        paid_at: new Date()
      }
    }
  );
  ```
* **Bước 132: Trừ Kho Vật lý Chính thức khi Cập nhật Thành công**:
  Nếu `updateResult.modifiedCount === 1` (Lần đầu tiên xử lý sự kiện):
  * Lặp qua mảng linh kiện đã thay thế, gọi MongoDB: `await InventoryItem.updateOne({ part_code: item.code }, { $inc: { stock_quantity: -item.quantity } });`.
  * Xóa bỏ hoàn toàn key `hold:${order_code}:${item.code}` trên Redis.
  * Giảm số lượng `reserved:part:${item.code}` tương ứng trên Redis.
* **Bước 133: Cập nhật Trạng thái Sự kiện Outbox về `PROCESSED`**:
  Thực thi trên PostgreSQL:
  `UPDATE outbox_events SET processed_status = 'PROCESSED', processed_at = NOW() WHERE event_id = $1;`.
* **Bước 134: Xử lý Cơ chế Retry Lũy thừa (Exponential Backoff)**:
  Nếu kết nối MongoDB bị ngắt quãng giữa chừng, tăng `retry_count = retry_count + 1`. Nếu thử lại quá 5 lần thất bại, chuyển trạng thái sự kiện sang `DEAD_LETTER` và kích hoạt chuông cảnh báo quản trị viên gara.

---

## 3.7 Phân hệ Realtime Socket.io & Điều phối Tiến độ khoang xưởng (UC-04) (Bước 135 -> Bước 140)
* **Bước 135: Khởi tạo Socket.io Server tích hợp trong `src/sockets/index.js`**:
  Gắn Socket.io vào HTTP server Node.js, thiết lập CORS cho phép kết nối WebSocket từ giao diện Next.js client.
* **Bước 136: Thiết kế Kiến trúc Phòng (Rooms) trong Socket.io**:
  * `room:order:${order_code}`: Dành riêng cho khách hàng theo dõi chiếc xe cụ thể của mình.
  * `room:workshop`: Dành cho toàn bộ thợ kỹ thuật trong xưởng nhận lệnh sửa chữa mới.
  * `room:kanban`: Dành cho màn hình điều phối tổng quan của Quản đốc và Giám đốc gara.
* **Bước 137: Xây dựng Sự kiện Tham gia Phòng `join_order`**:
  Khách hàng sau khi xác thực OTP thành công sẽ tự động gửi socket event `join_order` kèm theo `order_code` để lắng nghe mọi biến động liên quan đến chiếc xe.
* **Bước 138: Xây dựng Controller Kỹ thuật viên Cập nhật Tiến độ `updateProgressController`**:
  Kỹ thuật viên tại khoang xưởng gửi lên: `order_code`, `stage_name`, `percent_complete`, và URL ảnh chụp linh kiện cũ/mới đã tải lên máy chủ.
* **Bước 139: Lưu vết Biên bản Nghiệm thu vào MongoDB**:
  Đẩy dữ liệu vào mảng `inspection_photos` và `workflow_timeline` trong document `WorkOrder`.
* **Bước 140: Bắn Sự kiện Realtime `PROGRESS_UPDATED` tới Client**:
  Gọi `io.to("room:order:" + order_code).emit("PROGRESS_UPDATED", data)`. Giao diện điện thoại của khách hàng lập tức nhảy bước tiến độ và hiển thị hình ảnh thực tế mà không cần tải lại trang.

---

# GIAI ĐOẠN 4: XÂY DỰNG GIAO DIỆN FRONTEND (NEXT.JS 14 & TAILWIND CSS) (Bước 141 -> Bước 200)

## 4.1 Khởi tạo Dự án Next.js 14 App Router & Base Layout (Bước 141 -> Bước 150)
* **Bước 141: Khởi tạo ứng dụng Next.js 14 bằng App Router**:
  Tại thư mục gốc dự án, di chuyển vào thư mục frontend:
  `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.
* **Bước 142: Cài đặt các gói thư viện UI & Icons phụ trợ**:
  `cd frontend && npm install lucide-react clsx tailwind-merge axios socket.io-client canvas-confetti react-signature-canvas sonner`.
  Cài đặt thêm kiểu gõ TypeScript: `npm install --save-dev @types/canvas-confetti @types/react-signature-canvas`.
* **Bước 143: Thiết kế Hệ màu Thương hiệu trong `tailwind.config.ts`**:
  Cấu hình Palette màu nhận diện của HIHIHAHA_AUTO:
  * Màu xanh thương hiệu chủ đạo (`brand-blue`): `#0f2b5c` (Đẳng cấp, tin cậy).
  * Màu cam kỹ thuật (`brand-orange`): `#f97316` (Năng động, thể thao).
  * Màu kim loại xưởng (`brand-slate`): `#334155` (Chuyên nghiệp).
  * Màu báo động/thời hạn (`brand-red`): `#ef4444`.
* **Bước 144: Cấu hình Typography và Responsive Breakpoints**:
  Đảm bảo giao diện co giãn hoàn hảo từ điện thoại cá nhân (375px - Mobile-First) cho khách hàng tới máy tính bảng iPad/Galaxy Tab (768px - 1024px) đặt tại xưởng sửa chữa.
* **Bước 145: Thiết lập Root Layout chung `src/app/layout.tsx`**:
  Tích hợp thẻ meta viewport chuẩn thiết bị di động, favicon ô tô, bộ đệm thông báo `Toaster` từ thư viện `sonner`, và font chữ `Inter` tối ưu hiển thị tiếng Việt.
* **Bước 146: Xây dựng Next.js Edge Middleware Chặn Ranh giới Đơn miền `src/middleware.ts`**:
  Bảo vệ an toàn cấp mạng trên cùng 1 tên miền `hihihaha.vn`:
  * Trích xuất token từ Cookie; tự động chuyển hướng về `/login` nếu truy cập khu vực nội bộ khi chưa đăng nhập.
  * Nếu Khách hàng (`CUSTOMER`) cố tình gõ link `/admin/*`, `/technician/*`, `/workshop/*` $ightarrow$ Ngay lập tức chặn đứng và đẩy ngược về `/customer/dashboard`.
  * Nếu Thợ xưởng (`TECHNICIAN`) cố tình vào xem doanh thu `/admin/*` $ightarrow$ Chặn đứng và đẩy về `/technician`.
* **Bước 147: Thiết lập Kiến trúc Route Groups Độc lập và Zustand Store `src/store/useAuthStore.ts`**:
  * Phân chia thư mục giao diện theo Route Groups độc lập: `src/app/(customer)/` (Giao diện Mobile-First tinh giản, không Sidebar), `src/app/(technician)/` (Giao diện Tablet cảm ứng nút to), `src/app/(admin)/` (Dashboard quản trị đầy đủ).
  * Xây dựng Zustand Store lưu trữ `user`, `role`, `licensePlate`, `token`, và các hàm `login()`, `logout()`, `switchRoleRedirect()`.
* **Bước 148: Xây dựng Thanh điều hướng Navbar `src/components/Navbar.tsx`**:
  Hiển thị Logo HIHIHAHA_AUTO, số hotline hỗ trợ kỹ thuật `1900-HIHIHAHA`, biểu tượng biển số xe đang xem, và nút đăng xuất bảo mật.
* **Bước 149: Xây dựng Chân trang Footer `src/components/Footer.tsx`**:
  Hiển thị địa chỉ gara, thời gian làm việc (7:30 - 18:00), thông tin giấy phép và cam kết phụ tùng chính hãng 100%.
* **Bước 150: Xây dựng Trang Báo lỗi & 404 Không tìm thấy `src/app/not-found.tsx`**:
  Giao diện thân thiện hướng dẫn khách hàng quay lại màn hình tra cứu bảo dưỡng nếu gõ nhầm đường dẫn.

---

## 4.2 Portal Khách hàng: Tra cứu Kép & Nhập OTP Gmail (UC-01) (Bước 151 -> Bước 160)
* **Bước 151: Thiết kế Cổng Đăng nhập Thông minh Hợp nhất `src/app/login/page.tsx` & Tự động Phân luồng**:
  Giao diện đăng nhập hiện đại phân thành 2 phân khu rõ ràng:
  * **Tab 1 - Khách hàng (Chủ xe)**: Đăng nhập không mật khẩu bằng Biển số xe + Số điện thoại $ightarrow$ Nhập OTP Gmail $ightarrow$ Tự động chuyển hướng (Auto-Redirect) vào `/customer/work-order/:code`. Khách tuyệt đối không thấy menu nội bộ của thợ hay quản trị.
  * **Tab 2 - Cán bộ Nhân viên Gara**: Đăng nhập Email/Mã nhân viên + Mật khẩu $ightarrow$ Đọc `role` từ JWT tự động phân luồng: Thợ về `/technician`, Cố vấn về `/advisor`, Quản đốc về `/workshop/kanban`, Thủ kho về `/admin/inventory`, Giám đốc về `/admin/dashboard`.
* **Bước 152: Xây dựng Form Nhập liệu Xác thực Kép (Dual Input Form)**:
  Bao gồm 2 ô nhập liệu bắt buộc:
  * Ô 1: Biển số xe (Tự động format chữ in hoa và thêm dấu chấm gạch, ví dụ nhập `51k88888` tự chuyển thành `51K-888.88`).
  * Ô 2: Số điện thoại đăng ký xe (Chỉ cho phép nhập 10 chữ số).
* **Bước 153: Xử lý Kiểm tra Tính hợp lệ Phía Client (Client-Side Validation)**:
  Sử dụng biểu thức chính quy (Regex) kiểm tra chuẩn biển số xe cơ giới Việt Nam và đầu số di động mạng Viettel, Vina, Mobi.
* **Bước 154: Nút bấm "Gửi mã OTP bảo mật qua Email"**:
  Tích hợp trạng thái Loading Spinner khi đang gọi mạng, vô hiệu hóa nút bấm để ngăn chặn người dùng bấm nhiều lần gây trùng lặp.
* **Bước 155: Kết nối API Gửi OTP `/api/v1/auth/request-otp`**:
  Nhận về email che mờ từ máy chủ (ví dụ `m***o@gmail.com`). Cập nhật giao diện mở Modal nhập mã bảo mật.
* **Bước 156: Xây dựng Modal Nhập OTP 6 Ô Tự động Chuyển Con trỏ (Auto-focus)**:
  Tạo component 6 ô nhập số độc lập: Tự động nhảy sang ô tiếp theo khi gõ xong 1 chữ số, tự động lùi lại khi bấm Backspace, hỗ trợ dán (Paste) mã 6 số từ clipboard.
* **Bước 157: Thiết lập Đồng hồ Đếm ngược Thời gian Thực (Live Countdown)**:
  * Đồng hồ đếm ngược 60 giây làm mát: Nút "Gửi lại mã" chỉ sáng lên khi hết 60s (phù hợp với Redis cooldown).
  * Đồng hồ đếm ngược 5 phút thời hạn OTP: Hiển thị vạch cảnh báo màu vàng chuyển dần sang đỏ khi sắp hết hạn.
* **Bước 158: Xử lý Gửi mã OTP Xác thực `/api/v1/auth/verify-otp`**:
  Khi đủ 6 ký tự, tự động kích hoạt API kiểm tra mà không cần bấm thêm nút nào.
* **Bước 159: Lưu trữ Phiên Đăng nhập & Điều hướng Tự động**:
  Lưu `accessToken` vào Cookie an toàn (hoặc LocalStorage), lưu thông tin xe vào Zustand Store, sau đó chuyển hướng tức thì sang `/customer/work-order/WO-20261001-0089`.
* **Bước 160: Xử lý Hiển thị Lỗi Tinh tế**:
  Hiển thị hộp cảnh báo màu đỏ nhẹ nhàng nếu sai số điện thoại ("Số điện thoại không khớp với thông tin đăng ký xe") hoặc nhập sai OTP quá số lần quy định.

---

## 4.3 Portal Khách hàng: Chi tiết Báo giá Động & Ký điện tử Phê duyệt (UC-02) (Bước 161 -> Bước 170)
* **Bước 161: Thiết kế Trang Chi tiết Lệnh sửa chữa `src/app/customer/work-order/[code]/page.tsx`**:
  Layout trực quan hiển thị mã Lệnh sửa chữa, ngày tiếp nhận, tình trạng hiện tại và thông tin Cố vấn phụ trách.
* **Bước 162: Xây dựng Thẻ Hồ sơ Xe Đang Sửa chữa (Vehicle Banner) & Trang Sổ Bảo Dưỡng Điện Tử `src/app/customer/vehicles/page.tsx` (`SCR-CUS-06`)**:
  Hiển thị hình ảnh xe, Model: Toyota Camry 2.5Q, Biển số: `51K-888.88`, Số ODO lúc vào xưởng: 45.200 km; tích hợp nút xem Sổ bảo dưỡng điện tử trọn đời (dòng thời gian các lần bảo dưỡng, phụ tùng đã thay, bảo hành) và nút gửi Yêu cầu đổi biển số / cập nhật thông tin chủ xe kèm đính kèm ảnh giấy Đăng ký xe (Cà-vẹt).
* **Bước 163: Xây dựng Bảng Báo giá Động Chia 2 Khối Độc lập**:
  * **Khối 1 - Tiền công Kỹ thuật**:
    - Công thay má phanh trước: 450.000 đ
    - Vệ sinh họng nạp & buồng đốt: 300.000 đ
    - *Tổng tiền công*: 750.000 đ
  * **Khối 2 - Phụ tùng & Linh kiện Thay thế**:
    - Bộ má phanh chính hãng Toyota (`04465-06100`): 1.850.000 đ
    - Cặp gạt mưa Silicon mềm: 350.000 đ
    - *Tổng phụ tùng*: 1.850.000 đ
* **Bước 164: Tích hợp Checkbox Tùy chọn Linh hoạt**:
  Khách hàng có quyền tick chọn chấp nhận hoặc từ chối hạng mục gạt mưa hoặc vệ sinh họng nạp nếu muốn tiết kiệm chi phí.
* **Bước 165: Tính toán Thuế & Tổng tiền Tự động Theo Thời gian Thực**:
  Khi khách bỏ chọn một hạng mục:
  * Tổng tiền trước thuế lập tức giảm trừ tương ứng.
  * Thuế VAT 8% tự động tính lại theo công thức: `pretax * 0.08`.
  * Tổng tiền thanh toán cuối cùng hiển thị to, rõ ràng, minh bạch từng đồng xu.
* **Bước 166: Kiểm tra Tính toán Chuẩn xác 100% với Số liệu SRS**:
  Khi giữ nguyên đầy đủ các hạng mục tiêu chuẩn:
  * Tổng tiền công: 750.000 đ
  * Tổng phụ tùng: 1.850.000 đ (gồm má phanh và gạt mưa) -> Tổng trước thuế: 2.600.000 đ.
  * Thuế VAT (8%): 208.000 đ.
  * **Tổng tiền phê duyệt cuối cùng: Đúng 2.808.000 đ**.
* **Bước 167: Tích hợp Khung Ký tay Điện tử (Digital Signature Pad)**:
  Sử dụng thư viện `react-signature-canvas` để khách hàng ký tên trực tiếp bằng ngón tay trên màn hình cảm ứng điện thoại, kèm nút "Xóa chữ ký để ký lại".
* **Bước 168: Nút Phê duyệt Báo giá "Đồng ý Thi công & Khóa Phụ tùng"**:
  Gửi yêu cầu API `POST /api/v1/work-orders/:code/approve` kèm mảng các hạng mục đã duyệt và ảnh chữ ký base64.
* **Bước 169: Hiệu ứng Pháo hoa Chúc mừng (Confetti Animation)**:
  Bắn hiệu ứng pháo hoa bằng thư viện `canvas-confetti` tạo trải nghiệm tích cực cho khách hàng khi giao xe cho trung tâm chăm sóc.
* **Bước 170: Kích hoạt Huy hiệu Trạng thái "Đã Phê duyệt - Đang Cấp Phát Phụ Tùng & Thi Công"**:
  Hiển thị thanh trạng thái màu xanh lá (`APPROVED` -> `IN_PROGRESS`) kèm phụ tùng đã được xuất kho vật lý an toàn ra cầu nâng cho thợ thao tác.

---

## 4.4 Portal Khách hàng: Màn hình Thanh toán VietQR / VNPay Sandbox (UC-03) (Bước 171 -> Bước 180)
* **Bước 171: Thiết kế Trang Thanh toán Trực tuyến `src/app/customer/payment/[code]/page.tsx`**:
  Giao diện tối ưu thao tác chuyển khoản ngân hàng và thanh toán điện tử không tiền mặt (kích hoạt khi xe hoàn thành sửa chữa `COMPLETED`).
* **Bước 172: Xây dựng Đồng hồ Đếm ngược Thời hạn Thanh toán $T_{pay} = 10\text{ Phút}$**:
  Hiển thị vạch đếm ngược thời gian từ 10:00 về 00:00 màu đỏ cảnh báo:
  *"Quý khách vui lòng hoàn tất quét mã trong vòng 10 phút. Quá thời gian trên, mã VietQR sẽ hết hạn, quý khách có thể bấm tạo mã mới hoặc thanh toán trực tiếp tại quầy lễ tân"*.
* **Bước 173: Tạo Mã VietQR Chuẩn Napas247 Động**:
  Tạo mã QR chuyển khoản tự động bằng URL chuẩn VietQR:
  `https://img.vietqr.io/image/970422-123456789-compact2.png?amount=2808000&addInfo=WO-20261001-0089&accountName=HIHIHAHA_AUTO`.
* **Bước 174: Tích hợp Nút Chuyển hướng Cổng VNPay Sandbox**:
  Nút bấm "Thanh toán qua Thẻ ATM / Visa / Ví VNPay": Gọi API lấy URL thanh toán VNPay và chuyển hướng trình duyệt tới cổng thanh toán kiểm thử an toàn của VNPay.
* **Bước 175: Hướng dẫn Sử dụng Thẻ Kiểm thử VNPay Sandbox**:
  Hiển thị bảng thông tin thẻ test có sẵn để giảng viên và người đánh giá dễ dàng kiểm thử:
  * Ngân hàng: NCB
  * Số thẻ: `9704198526191432198`
  * Tên chủ thẻ: `NGUYEN VAN A`
  * Ngày phát hành: `07/15`
  * Mật khẩu OTP: `123456`
* **Bước 176: Tích hợp WebSocket Client Lắng nghe Sự kiện Thanh toán**:
  Khởi tạo kết nối Socket.io trong hook `useEffect`:
  ```javascript
  socket.emit('join_order', { order_code });
  socket.on('PAYMENT_COMPLETED', (data) => {
    // Tự động chuyển trang khi máy chủ nhận được IPN từ VNPay
    router.push(`/customer/payment-result?order_code=${order_code}`);
  });
  ```
* **Bước 177: Thiết kế Trang Kết quả Thanh toán Thành công `src/app/customer/payment-result/page.tsx`**:
  Hiển thị dấu tích xanh to lớn, số tiền đã quyết toán: **2.808.000 VNĐ**, mã giao dịch VNPay, mã tham chiếu ngân hàng và thời gian thực thi.
* **Bước 178: Xây dựng Nút Xem & Tải Hóa đơn Điện tử (VAT E-Invoice)**:
  Cho phép khách hàng xem mẫu hóa đơn tài chính với đầy đủ thuế suất VAT 8%, mã số thuế doanh nghiệp HIHIHAHA_AUTO.
* **Bước 179: Nút "Xem Tiến độ Sửa chữa Trực tiếp tại Khoang Xưởng"**:
  Chuyển tiếp khách hàng đến màn hình Live Tracking theo dõi thợ đang thao tác lắp ráp má phanh mới trên chiếc xe của mình.
* **Bước 180: Xử lý Tình huống Quá hạn Thanh toán (Payment Expired)**:
  Nếu đồng hồ 10 phút chạm mốc 00:00: Vô hiệu hóa mã VietQR, gọi API hủy link thanh toán và hiển thị nút "Tạo lại liên kết thanh toán mới".

---

## 4.5 Giao diện Khoang xưởng dành cho Kỹ thuật viên (Tablet Touch-First) (Bước 181 -> Bước 190)
* **Bước 181: Thiết kế Giao diện Tablet Khoang Kỹ thuật `src/app/(technician)/page.tsx`**:
  Giao diện Touch-First tối ưu cho màn hình cảm ứng gắn tại tay nâng thủy lực: Nút bấm kích thước lớn (tối thiểu 56x56px), độ tương phản cao, chống nhầm lẫn khi tay dính dầu mỡ.
* **Bước 182: Tính năng Đăng nhập Nhanh bằng Mã PIN 4 số (Quick PIN Switch) & Lọc Đúng Xe Phụ Trách**:
  * Thợ chạm vào avatar cá nhân trên Tablet khoang nâng và gõ PIN 4 số (không cần gõ email/password dài).
  * Giao diện chỉ tải danh sách các xe **được Quản đốc phân công đích danh cho mình** (`assigned_technicians`), thợ không thể thấy hay thao tác nhầm vào xe của khoang khác.
* **Bước 183: Nút Bấm "Bắt đầu Thực hiện Hạng mục" (Start Working)**:
  Thợ bấm nhận việc, hệ thống kích hoạt đổi trạng thái Lệnh sang `IN_PROGRESS`, ghi nhận chính xác thời gian bắt đầu và mã định danh thợ vào mảng `assigned_technicians` trong MongoDB.
* **Bước 184: Chức năng Tải Ảnh Nghiệm thu Trực tiếp từ Camera Máy tính bảng**:
  Thợ bấm nút mở camera thiết bị:
  * Chụp ảnh 1: Cận cảnh má phanh cũ đã mòn trơ kim loại.
  * Chụp ảnh 2: Cận cảnh bộ má phanh Toyota mới tinh nguyên hộp và hình ảnh sau khi đã siết bu-lông vào cùm phanh xe.
* **Bước 185: Thanh Kéo Cập nhật Phần trăm Tiến độ Công việc**:
  Slider chạm vuốt trực quan: 0% -> 25% (Đã tháo lốp) -> 50% (Đang thay má phanh) -> 75% (Đang xả gió dầu phanh) -> 100% (Đã hoàn tất thử phanh).
* **Bước 186: Tích hợp Trợ lý AI Kỹ thuật & Khai phá Kho 50.000 Linh kiện (Graph-RAG Modal `SCR-WRK-04`)**:
  * Thợ khoang máy bấm nút `[🤖 HỎI CỐ VẤN AI (Graph-RAG)]` trên Tablet để mở modal chẩn đoán.
  * Thợ nhập triệu chứng tiếng Việt tự nhiên: *"Đạp phanh nghe tiếng rít kim loại ken két ở 2 bánh trước, xe bị giật nhẹ khi dừng đèn đỏ"*.
  * Hệ thống kích hoạt pipeline Graph-RAG 3 chặng: Dùng MongoDB Text Index lọc top 8 ứng viên kho khả dụng ($Q_{stock} > 0$), kết hợp Neo4j mở rộng cụm phanh/khung gầm, cấp làm Grounding Context cho Gemini 2.5 Flash trả về JSON chuẩn.
* **Bước 187: Hiển thị Thẻ Gợi ý AI Grounded & Nút 1-Click Áp dụng vào Lệnh sửa chữa**:
  * Giao diện Tablet hiển thị kết quả phân tích: Chẩn đoán má phanh trước mòn chạm chỉ báo an toàn (Mức độ HIGH); Đề xuất bộ má phanh chính hãng Toyota mã OEM `04465-06100` (Còn 5 bộ, Kệ A1-04, 1.850.000 đ) + Công thay & láng đĩa phanh (450.000 đ).
  * Trong trường hợp kho hết hàng chính hãng, AI gợi ý thêm mã thay thế tương thích cơ khí từ Neo4j: `04465-33480` (Lexus ES250 - Nền tảng TNGA-K).
  * Thợ bấm `[ Áp dụng vào Lệnh sửa chữa ]`: Tự động nạp hạng mục vào Báo giá/Lệnh sửa chữa mà không cần gõ thủ công.
* **Bước 188: Nút Chuyển Giai đoạn Kiểm định Chất lượng (KCS / QC Inspection)**:
  Thợ bấm "Yêu cầu Quản đốc nghiệm thu": Tự động gửi thông báo đến máy tính bảng của Kỹ sư trưởng xưởng để ra kiểm tra lực siết và chạy thử xe.
* **Bước 189: Hiệu ứng Cảnh báo Âm thanh (Audio Cue)**:
  Tích hợp âm thanh chuông thông báo ngắn khi Quản đốc giao xe mới vào khoang hoặc khi khách hàng đồng ý duyệt báo giá phát sinh.
* **Bước 190: Kiểm thử Trải nghiệm Cảm ứng trên Màn hình Tablet**:
  Thử nghiệm thao tác vuốt, chạm, chụp ảnh trên kích thước màn hình 10.2 inch và 11 inch đảm bảo không bị giật lag và không bị tràn khung hình.

---

## 4.6 Giao diện Bảng điều phối Kanban & Dashboard Quản lý Gara (Bước 191 -> Bước 200)
* **Bước 191: Thiết kế Màn hình Kanban Board Điều phối Xưởng `src/app/admin/kanban/page.tsx`**:
  Màn hình dành riêng cho màn hình TV lớn treo giữa xưởng hoặc màn hình làm việc của Quản đốc dịch vụ.
* **Bước 192: Tích hợp Thư viện Kéo thả Trực quan `@hello-pangea/dnd`**:
  Cài đặt thư viện xử lý kéo thả drag-and-drop mượt mà, hỗ trợ cả chuột máy tính lẫn ngón tay cảm ứng.
* **Bước 193: Thiết lập 7 Làn (Columns) Quy trình Gara Tiêu chuẩn**:
  1. `TIẾP NHẬN & GIÁM ĐỊNH` (Màu xanh lam nhạt)
  2. `CHỜ KHÁCH DUYỆT GIÁ` (Màu vàng cam)
  3. `ĐÃ DUYỆT - CHỜ PHỤ TÙNG` (Màu tím)
  4. `ĐANG THI CÔNG TRONG KHOANG` (Màu xanh dương đậm)
  5. `KIỂM TRA CHẤT LƯỢNG KCS` (Màu cánh sen)
  6. `CHỜ THANH TOÁN` (Màu cam đậm)
  7. `HOÀN TẤT & SẴN SÀNG GIAO XE` (Màu xanh lá)
* **Bước 194: Thiết kế Thẻ Xe Kanban & Hộp Phân công Khoang & Thợ (Job Dispatching Modal)**:
  * Trên thẻ Kanban: Hiển thị Biển số, Tên Cố vấn, Khoang nâng (Bay 01, Bay 02...), Tên Thợ chính, Thợ phụ và đồng hồ đếm giờ.
  * Quản đốc bấm vào thẻ xe để mở Modal: Chọn Khoang nâng, chọn Thợ chính (Bậc 4/7), Thợ phụ (Học việc), đặt thời hạn cam kết xong (Target Completion Time).
* **Bước 195: Kích hoạt Gán việc & Bắn Tín hiệu Realtime xuống Tablet Khoang**:
  Khi Quản đốc lưu phân công:
  * Backend gọi API `POST /api/v1/work-orders/:code/assign`, lưu vào mảng `assigned_technicians` và ghi vết kiểm toán `audit_logs`.
  * Socket.io phát sóng thẳng đến Tablet gắn tại Khoang máy tương ứng: Rung chuông cảnh báo và nạp ngay công việc mới lên màn hình thợ.
* **Bước 196: Đồng bộ WebSocket Hai chiều (Bidirectional Realtime Kanban)**:
  Khi thợ tại khoang xưởng bấm hoàn thành 100% trên Tablet, thẻ xe trên màn hình TV Kanban của Quản đốc tự động trượt sang cột KCS mà không cần ai phải bấm F5 tải lại.
* **Bước 197: Xây dựng Dashboard Quản trị & Màn hình Tiếp Nhận Hồ Sơ Phương Tiện, Sang Tên Đổi Chủ Xe `src/app/admin/vehicles/page.tsx` (`SCR-ADV-02`)**:
  Cố vấn dịch vụ và Admin tra cứu hồ sơ xe theo số khung VIN hoặc biển số cũ, đối chiếu giấy Đăng ký xe mới (Cà-vẹt), chọn khách hàng mới từ danh sách hoặc nhập SĐT mới, kích hoạt lệnh cập nhật đồng bộ nguyên tử (Atomic Multi-Document Transaction) giữa Document `Vehicle` và `Customer`.
* **Bước 198: Biểu đồ Doanh thu & Cơ cấu Chi phí Bằng Recharts**:
  Biểu đồ cột chồng hiển thị doanh thu theo ngày: Tách bạch rõ ràng doanh thu từ tiền công dịch vụ kỹ thuật và doanh thu từ bán lẻ phụ tùng ô tô.
* **Bước 199: Màn hình Quản lý Danh mục Kho & Phiếu Kiểm kê Đầu tháng `src/app/admin/inventory/page.tsx`**:
  * Bảng danh mục phụ tùng: Tìm kiếm tức thì với Text Index, bộ lọc phân loại, nút Thêm mới/Chỉnh sửa phụ tùng.
  * Tính năng **Kiểm kê & Điều chỉnh Tồn kho Đầu tháng**: Nút "Tạo Phiếu Kiểm kê Mới", bảng đối soát hiển thị số lượng tồn sổ sách ($Q_{sys}$), ô nhập số lượng thực tế kiểm đếm ($Q_{actual}$), tự động hiển thị độ lệch màu đỏ/xanh ($\pm \Delta$) và hộp chọn lý do điều chỉnh (*Số dư đầu kỳ*, *Hao hụt tự nhiên*, *Hỏng vỡ kệ*, *Nhập bổ sung*).
  * Khối cảnh báo tồn kho tối thiểu (Low-Stock Alert): Nổi bật các mặt hàng $\le$ `min_threshold` với nút bấm xuất đơn đặt hàng nhanh.
* **Bước 200: Kiểm thử Toàn diện Tương thích Đa nền tảng cho Giao diện**:
  Kiểm tra hiển thị đồng bộ trên Google Chrome, Apple Safari, Microsoft Edge, và trên cả 3 kích thước thiết bị: Di động khách, Tablet thợ, Desktop Quản đốc.

---

# GIAI ĐOẠN 5: KIỂM THỬ TOÀN DIỆN & TỐI ƯU HỆ THỐNG (Bước 201 -> Bước 235)

## 5.1 Viết Unit Tests & Integration Tests với Jest/Supertest (Bước 201 -> Bước 210)
* **Bước 201: Cài đặt và cấu hình môi trường kiểm thử Jest**:
  Tạo file `backend/jest.config.js`:
  ```javascript
  module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/*.test.js'],
    verbose: true,
    forceExit: true
  };
  ```
* **Bước 202: Viết Unit Test cho Module Tính toán Báo giá & Thuế VAT `tests/unit/estimate.test.js`**:
  Kiểm thử tính toán chính xác tuyệt đối các con số tài chính:
  * Đầu vào: Bộ má phanh (1.850.000 đ), Công thay (450.000 đ), Gạt mưa (350.000 đ), Vệ sinh họng nạp (300.000 đ).
  * Kiểm tra tiền công: đúng `750.000 đ`.
  * Kiểm tra phụ tùng: đúng `1.850.000 đ`.
  * Kiểm tra tổng trước thuế: đúng `2.600.000 đ`.
  * Kiểm tra thuế VAT 8%: đúng `208.000 đ`.
  * Kiểm tra tổng thanh toán cuối cùng: đúng chính xác `2.808.000 đ`.
* **Bước 203: Viết Unit Test cho Thuật toán Băm Chữ ký VNPay `tests/unit/vnpay.test.js`**:
  Kiểm thử hàm băm SHA-512 với các tham số đầu vào cố định và so sánh với giá trị băm mẫu được tài liệu kỹ thuật VNPay cung cấp để đảm bảo không bị sai lệch chữ hoa/thường hoặc thứ tự từ điển.
* **Bước 204: Viết Integration Test cho Module Xác thực Kép & OTP Gmail `tests/integration/auth.test.js`**:
  Sử dụng `supertest` giả lập gửi yêu cầu `POST /api/v1/auth/request-otp` với cặp Biển số và Số điện thoại hợp lệ, kiểm tra API trả về mã `200 OK` và email được che mờ (`m***o@gmail.com`).
* **Bước 205: Viết Test Case Kiểm tra Cơ chế Chặn Spam Cooldown 60s của Redis**:
  Gửi 2 request OTP liên tiếp trong vòng 1 giây cho cùng một email, kiểm tra request thứ hai nhận phản hồi `429 TOO_MANY_REQUESTS` với thông điệp yêu cầu chờ 60 giây.
* **Bước 206: Viết Test Case Kiểm tra Giới hạn 5 lần/ngày**:
  Giả lập tăng biến đếm `ratelimit:daily_email` lên 5 trong Redis, gửi tiếp request thứ 6 và kiểm tra hệ thống từ chối phục vụ để bảo vệ uy tín hòm thư Gmail của gara.
* **Bước 207: Viết Integration Test cho API Tra cứu Lệnh sửa chữa & Chặn Xem Trộm IDOR `tests/integration/work-order.test.js`**:
  Kiểm tra quyền truy cập phân quyền 2 lớp (RBAC + Row-Level Security):
  * Dùng Token của khách hàng sở hữu xe `51K-888.88` cố tình truy vấn lệnh của xe `30L-999.99` $\rightarrow$ Kiểm tra API trả về chính xác mã lỗi `403 FORBIDDEN`.
  * Dùng Token của Cố vấn dịch vụ / Quản đốc gọi cùng endpoint $\rightarrow$ Kiểm tra API trả về mã `200 OK` (Nhân viên được xem mọi xe).
* **Bước 208: Viết Integration Test cho Trợ lý AI Graph-RAG & Zero-Hallucination `tests/integration/ai-assistant.test.js`**:
  Gửi request chẩn đoán với triệu chứng tiếng Việt: *"đạp phanh nghe tiếng rít kim loại ken két ở bánh trước"*:
  * Kiểm tra phản hồi trả về đúng định dạng JSON Schema nghiêm ngặt (`responseSchema`).
  * Kiểm tra trường `suggested_parts`: Đảm bảo 100% mã phụ tùng trả về (`04465-06100`) phải có thật trong danh mục kho MongoDB (Zero Hallucination), không bao giờ tự bịa mã phụ tùng.
* **Bước 209: Thiết lập Lệnh Chạy Bộ Test Toàn Diện 6 Tầng Kiểm Thử**:
  Bổ sung vào `backend/package.json`: `"test": "jest --detectOpenHandles --runInBand --coverage"`.
* **Bước 210: Kiểm tra Độ phủ Kiểm thử (Code Coverage) & Báo cáo QA**:
  Chạy lệnh `npm test` và kiểm tra báo cáo HTML trong thư mục `coverage/`: Đảm bảo độ bao phủ các nhánh logic trọng yếu (Branches) đạt trên 85% cho các phân hệ nhạy cảm tài chính và kho vật tư.

---

## 5.2 Kiểm thử Concurrency & Chống Bán khống với Autocannon / K6 (Bước 211 -> Bước 218)
* **Bước 211: Cài đặt công cụ đo tải hiệu năng cao Autocannon**:
  Cài đặt công cụ đo tải HTTP tốc độ cao: `npm install -g autocannon`.
* **Bước 212: Chuẩn bị Kịch bản Kiểm thử Tranh chấp Kho Tồn tại Cực hạn (Race Condition Test)**:
  * Nạp dữ liệu kiểm thử: Mã phụ tùng `TEST-PAD-01` chỉ còn **duy nhất 1 sản phẩm** trong kho vật lý MongoDB (`stock_quantity = 1`).
  * Khởi tạo 50 phiên làm việc ảo của 50 khách hàng khác nhau cùng xem báo giá có chứa mã linh kiện này.
* **Bước 213: Thiết lập Kịch bản Bắn Yêu cầu Đồng thời (Burst Request)**:
  Viết kịch bản Node.js bắn đồng thời 50 requests HTTP `POST /api/v1/work-orders/approve-estimate` tới máy chủ trong cùng 1 mili-giây (sử dụng `Promise.allSettled`).
* **Bước 214: Kích hoạt Đợt Bắn Tải Tranh chấp**:
  Chạy kịch bản và theo dõi nhật ký hoạt động của Redis Redlock:
  `const results = await Promise.allSettled(requests);`.
* **Bước 215: Đối soát Kết quả Sau Khi Tranh chấp Hoàn tất**:
  * Kiểm tra phản hồi HTTP: Đúng 1 request nhận mã `200 OK` (cấp phát kho thành công), 49 requests còn lại nhận mã `409 CONFLICT` hoặc `400 BAD_REQUEST` ("Phụ tùng vừa hết hàng khả dụng").
  * Kiểm tra MongoDB: `allocated_quantity` tăng chính xác bằng `1`, tồn kho vật lý không bị âm hay bán khống.
* **Bước 216: Khẳng định Giá trị Cấp độ Senior của Khóa Phân tán Redlock**:
  Ghi nhận bằng chứng chứng minh: Thuật toán Redlock giải quyết triệt để vấn đề Overselling (Bán khống) trong môi trường xử lý bất đồng bộ đa tiến trình.
* **Bước 217: Đo lường Độ trễ Giam khóa (Lock Acquisition Latency)**:
  Đo thời gian trung bình để xin cấp khóa và giải phóng khóa: Đạt trung bình 12ms - 18ms, hoàn toàn không gây nghẽn băng thông hệ thống.
* **Bước 218: Xuất Báo cáo Kết quả Đo tải**:
  Lưu biểu đồ và nhật ký đo tải vào thư mục tài liệu thuyết minh để chuẩn bị phản biện trước Hội đồng đánh giá đồ án.

---

## 5.3 Kiểm thử Phục hồi Lỗi Outbox Pattern & Giả lập Đứt kết nối CSDL (Bước 219 -> Bước 226)
* **Bước 219: Chuẩn bị Môi trường Kiểm thử Khả năng Chịu lỗi (Fault Injection Testing)**:
  Kịch bản: Giả lập sự cố máy chủ MongoDB bị sập nguồn đột ngột đúng vào thời điểm khách hàng vừa thanh toán thành công qua VNPay trên PostgreSQL.
* **Bước 220: Bắt đầu Luồng Thanh toán VNPay IPN**:
  Gửi yêu cầu Webhook IPN giả lập từ VNPay với mã phản hồi `00` (Thành công).
  * PostgreSQL cập nhật giao dịch sang `SUCCESS`.
  * PostgreSQL chèn sự kiện thanh toán vào bảng `outbox_events` với trạng thái `PENDING`.
* **Bước 221: Giả lập Ngắt kết nối Mạng MongoDB Ngay Tức khắc**:
  Chạy lệnh tạm dừng container MongoDB: `docker pause hihihaha_mongo`.
* **Bước 222: Theo dõi Hành vi của Outbox Polling Worker**:
  Tiến trình nền `outbox.worker.js` đọc được sự kiện `PENDING` từ PostgreSQL, cố gắng kết nối tới MongoDB để cập nhật Lệnh sửa chữa nhưng gặp lỗi kết nối (Connection Timeout).
  * Worker bắt ngoại lệ an toàn, không làm sập ứng dụng.
  * Tăng biến `retry_count` lên 1 trên PostgreSQL.
  * Sự kiện vẫn giữ nguyên ở bảng Outbox, không hề bị thất thoát dữ liệu!
* **Bước 223: Phục hồi Kết nối MongoDB**:
  Chạy lệnh khôi phục container: `docker unpause hihihaha_mongo`.
* **Bước 224: Quan sát Cơ chế Tự Phục hồi Hoàn toàn (Self-Healing)**:
  Ở chu kỳ quét tiếp theo (sau 2000ms), Outbox Worker thử lại thành công:
  * Cập nhật MongoDB WorkOrder sang `PAID`.
  * Trừ tồn kho vật lý của bộ má phanh vĩnh viễn.
  * Giải phóng khóa phiên thanh toán Idempotent trên Redis.
  * Đánh dấu sự kiện trong PostgreSQL thành `PROCESSED`.
* **Bước 225: Kiểm thử Thao tác Lặp Thông điệp (Duplicate Message Delivery)**:
  Cố tình bắn lại cùng một sự kiện Outbox lần thứ 2: Nhờ có điều kiện `{ payment_status: { $ne: "PAID" } }`, MongoDB trả về `modifiedCount = 0`, hàng tồn kho không bị trừ lần 2.
* **Bước 226: Khẳng định Tính Toàn vẹn Dữ liệu 100% (Zero Data Loss & At-Least-Once Delivery)**:
  Hệ thống duy trì tính nhất quán cuối cùng (Eventual Consistency) hoàn hảo giữa 2 hệ CSDL độc lập mà không cần đến cơ chế Two-Phase Commit (2PC) cồng kềnh.

---

## 5.4 Kiểm thử End-to-End Luồng Nghiệp vụ từ Tiếp nhận đến Giao xe (Bước 227 -> Bước 235)
* **Bước 227: Khởi động Toàn bộ Hệ sinh thái Ứng dụng**:
  Chạy đồng thời Backend (`localhost:5000`) và Frontend (`localhost:3000`).
* **Bước 228: E2E Bước 1 - Tiếp nhận Phương tiện & Lập Báo giá**:
  Cố vấn đăng nhập hệ thống, nhập xe Toyota Camry `51K-888.88`, chọn 4 hạng mục tiêu chuẩn, bấm "Phát hành Báo giá điện tử".
* **Bước 229: E2E Bước 2 - Khách hàng Nhận thông báo & Đăng nhập Kép**:
  Chủ xe mở trình duyệt điện thoại, nhập biển số `51K-888.88` và số điện thoại `0912.345.678`. Hệ thống gửi mã OTP 6 số vào hòm thư Gmail `minhthao@gmail.com`. Nhập OTP và vào trang xem xe.
* **Bước 230: E2E Bước 3 - Duyệt Báo giá & Cấp phát Phụ tùng ra Khoang xưởng**:
  Khách hàng kiểm tra tổng tiền đúng `2.808.000 đ`, dùng ngón tay ký tên lên khung vẽ cảm ứng, bấm "Ký duyệt Báo giá".
  * Backend dùng Redis Redlock 5s phân tán kiểm tra tồn kho và cấp phát thành công bộ má phanh (`allocated_quantity += 1`).
  * Lệnh sửa chữa chuyển sang `APPROVED` $\rightarrow$ `IN_PROGRESS`, xuất phiếu điều phối vật tư ra khoang nâng.
* **Bước 231: E2E Bước 4 - Thợ Khoang xưởng Thao tác & Tải ảnh Thực tế**:
  Kỹ thuật viên mở Tablet tại khoang nâng số 02, bấm "Bắt đầu làm", thi công láng đĩa phanh và lắp bộ má phanh mới. Chụp ảnh má phanh cũ mòn và má phanh mới lắp hoàn thiện tải lên. Khách hàng trên điện thoại nhìn thấy ngay ảnh nghiệm thu qua WebSocket.
* **Bước 232: E2E Bước 5 - Nghiệm thu KCS & Xuất Hóa đơn Quyết toán**:
  Kỹ thuật viên hoàn tất 100%. Quản đốc xưởng kiểm tra KCS đạt chuẩn an toàn, bấm duyệt chuyển trạng thái sang `COMPLETED`. Hệ thống tự động kích hoạt màn hình thanh toán cho khách hàng kèm tổng thanh toán chuẩn `2.808.000 đ`.
* **Bước 233: E2E Bước 6 - Thanh toán Trực tuyến qua Cổng VNPay & Khóa Idempotent**:
  Khách hàng bấm "Thanh toán ngay", Redis tạo Idempotent Lock 10 phút, mã VietQR hiển thị kèm vạch đếm ngược $T_{pay} = 10\text{ phút}$. Khách chọn cổng VNPay Sandbox, nhập thông tin thẻ test NCB (`9704198526191432198`), nhập OTP `123456`, bấm xác nhận thanh toán.
* **Bước 234: E2E Bước 7 - Nhận IPN, Outbox Đồng bộ, Tải Hóa đơn & Bàn giao Xe**:
  VNPay gửi IPN thành công về máy chủ. PostgreSQL ghi nhận giao dịch tài chính `SUCCESS`, Outbox Worker kích hoạt trừ kho má phanh vĩnh viễn trong MongoDB, chuyển trạng thái sang `PAID`, giải phóng khóa phiên Redis. Giao diện khách hàng tự động nhảy sang màn hình Hoàn tất & Tải Hóa đơn VAT PDF qua WebSocket. Thông tin đợt bảo dưỡng tự động lưu vào mảng `service_history` trong hồ sơ xe MongoDB. Khách nhận xe ra về!
* **Bước 235: Tổng kết Kiểm thử E2E Đạt Tiêu chuẩn Cao nhất**:
  Xác nhận toàn bộ chu trình nghiệp vụ khép kín từ lúc xe lăn bánh vào xưởng đến lúc xuất xưởng thanh toán hoạt động trơn tru không một lỗi phát sinh.

---

# GIAI ĐOẠN 6: ĐÓNG GÓI DOCKER, DEPLOY & CHUẨN BỊ BẢO VỆ ĐỒ ÁN (Bước 236 -> Bước 250)

## 6.1 Đóng gói Docker Container & Docker Compose Triển khai Hoàn chỉnh (Bước 236 -> Bước 242)
* **Bước 236: Xây dựng Dockerfile Tối ưu Hóa cho Backend `backend/Dockerfile`**:
  Sử dụng Multi-stage build với base image `node:20-alpine`:
  ```dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 5000
  CMD ["node", "src/server.js"]
  ```
* **Bước 237: Xây dựng Dockerfile Độc lập cho Frontend `frontend/Dockerfile`**:
  Cấu hình xuất bản Next.js Standalone mode giúp thu nhỏ dung lượng container xuống dưới 120MB, tăng tốc khởi động tối đa.
* **Bước 238: Tạo File `.dockerignore` Ngăn chặn Thư mục Rác**:
  Bỏ qua `node_modules`, `.git`, `.next`, `logs`, `coverage` nhằm giữ cho image Docker nhẹ nhàng, tối ưu hóa băng thông tải.
* **Bước 239: Xây dựng File Triển khai Toàn diện `docker-compose.prod.yml`**:
  Tích hợp hoàn chỉnh cả 6 dịch vụ trong cùng một mạng nội bộ ảo (`hihihaha_network`):
  1. `mongo`: MongoDB v7.0 kèm cấu hình Volume lưu trữ bền vững.
  2. `postgres`: PostgreSQL v16 kèm cấu hình khởi tạo bảng tự động.
  3. `neo4j`: Neo4j v5 Enterprise/Community kèm mở cổng Bolt 7687 và Web 7474.
  4. `redis`: Redis v7.2 kèm cấu hình Append Only File (AOF).
  5. `backend`: Node.js Express API Server (Cổng 5000).
  6. `frontend`: Next.js 14 Web Application (Cổng 3000).
* **Bước 240: Khởi chạy Trọn gói Dự án Chỉ Bằng Một Dòng Lệnh**:
  Tại thư mục gốc dự án, thực thi:
  `docker-compose -f docker-compose.prod.yml up -d --build`.
* **Bước 241: Kiểm tra Tình trạng Hoạt động Toàn Cụm Container**:
  Chạy lệnh `docker ps` để đảm bảo cả 6 container đều đang chạy ổn định ở trạng thái `Up (healthy)`.
* **Bước 242: Tự động Nạp Dữ liệu Mẫu Khởi tạo (Database Seeding in Container)**:
  Thực thi lệnh nạp dữ liệu mẫu ban đầu trực tiếp vào container:
  `docker exec -it hihihaha_backend node src/config/scripts/seed_mongo.js`
  `docker exec -it hihihaha_backend node src/config/scripts/seed_neo4j.js`

---

## 6.2 Kịch bản Demo Live & Chiến lược Trả lời Phản biện Đạt Điểm Tuyệt đối (Bước 243 -> Bước 250)
* **Bước 243: Bố trí Sân khấu Demo Đa Màn hình (Multi-Device Presentation Setup)**:
  Khi đứng trước Hội đồng bảo vệ, chia màn hình máy chiếu làm 3 cửa sổ trực quan:
  * **Cửa sổ 1 (Bên trái - Điện thoại)**: Giao diện Mobile Khách hàng (Đăng nhập OTP Gmail, xem báo giá 2.808.000 đ, duyệt giá, quét VietQR thanh toán).
  * **Cửa sổ 2 (Ở giữa - Máy tính bảng)**: Giao diện Tablet Kỹ thuật viên xưởng (Bấm bắt đầu công việc, tải ảnh má phanh cũ/mới, bấm nút tra cứu Neo4j).
  * **Cửa sổ 3 (Bên phải - Màn hình lớn)**: Bảng điều phối Kanban & Màn hình Dashboard Quản đốc tự động trượt thẻ xe theo thời gian thực (WebSocket).
* **Bước 244: Trình diễn Kịch bản Đỉnh cao 1: Khóa Phân tán Redlock Chống Tranh chấp Cấp phát Kho (Concurrency Defense)**:
  Mở 2 trình duyệt ẩn danh cùng bấm nút "Phê duyệt Báo giá" cho linh kiện cuối cùng trong kho. Chỉ cho giảng viên thấy: 1 bên thành công cấp phát và điều phối xe vào thi công, 1 bên lập tức báo hết hàng an toàn nhờ Redlock Mutex 5s.
* **Bước 245: Trình diễn Kịch bản Đỉnh cao 2: Sức mạnh Trợ lý AI Graph-RAG Khai phá Kho 50.000 Linh kiện & Đồ thị Neo4j**:
  Thao tác trên màn hình Tablet thợ:
  1. Mời giảng viên trực tiếp đọc một triệu chứng xe bằng tiếng Việt: *"Xe chạy qua chỗ xóc kêu lục cục ở bánh trước, đạp phanh hơi giật và kêu ken két"*.
  2. Bấm nút `[ HỎI CỐ VẤN AI (Graph-RAG) ]`.
  3. Chỉ cho Hội đồng thấy tốc độ phản hồi chớp nhoáng (< 800ms) của pipeline 3 chặng: MongoDB Text Index lọc thần tốc trong 50.000 phụ tùng kho, Neo4j duyệt đồ thị $N$-hops tìm phụ tùng cụm phanh, và Gemini 2.5 Flash trả về JSON chuẩn xác không một chút ảo giác (Zero Hallucination).
  4. Bấm 1 chạm `[ Áp dụng vào Lệnh sửa chữa ]`: Tự động chèn mã OEM `04465-06100` và công thợ 450.000 đ vào hệ thống trong sự trầm trồ của cả khán phòng!
* **Bước 246: Trình diễn Kịch bản Đỉnh cao 3: Transactional Outbox Pattern & Giả lập Đứt kết nối**:
  Thanh toán VNPay thành công, mở terminal gõ `docker pause hihihaha_mongo`. Chỉ cho Hội đồng thấy giao dịch tiền bạc trên PostgreSQL vẫn thành công, bảng Outbox ghi nhận sự kiện `PENDING`. Sau đó gõ `docker unpause hihihaha_mongo`, chỉ cho thấy Outbox Worker tự động thức dậy, trừ kho và đồng bộ trạng thái thành `PAID` hoàn hảo không mất một dòng log nào!
* **Bước 247: Chiến lược Trả lời Câu hỏi Phản biện 1: "Tại sao phải dùng Polyglot 4 DBMS thay vì 1 CSDL duy nhất?"**:
  *Câu trả lời mẫu*: "Dự án áp dụng nguyên lý Polyglot Persistence để tận dụng tối đa thế mạnh của từng loại CSDL:
  1. MongoDB lưu trữ dạng Document cực kỳ linh hoạt cho các Lệnh sửa chữa có cấu trúc lồng nhau (tiền công, phụ tùng, ảnh chụp, timeline) và Sổ bảo dưỡng trọn đời không có lược đồ cố định.
  2. PostgreSQL đảm bảo tính toàn vẹn giao dịch tài chính ACID tuyệt đối cho tiền thanh toán VNPay và làm hàng đợi Outbox bền bỉ.
  3. Neo4j xử lý các mối quan hệ đồ thị tương thích sâu nhiều tầng giữa Phụ tùng - Phân hệ - Khung gầm - Dòng xe với tốc độ Cypher vượt trội mà SQL JOIN hay Mongo `$lookup` sẽ bị nghẽn (O(N^2)).
  4. Redis In-Memory đảm bảo độ trễ siêu thấp dưới 2ms cho Khóa phân tán Redlock (cấp phát tồn kho), Khóa phiên thanh toán Idempotent (10 phút) và bộ đếm giới hạn OTP."
* **Bước 248: Chiến lược Trả lời Câu hỏi Phản biện 2: "Tại sao bỏ SMS Brandname và thay bằng Xác thực kép + Gmail OTP?"**:
  *Câu trả lời mẫu*: "Theo Nghị định 91/2020/NĐ-CP, việc đăng ký SMS Brandname viễn thông đòi hỏi giấy phép kinh doanh viễn thông, thời gian phê duyệt nhiều tháng và chi phí duy trì hàng tháng rất tốn kém, không khả thi cho một đề tài bảo vệ đồ án và các trung tâm dịch vụ vừa và nhỏ. Việc thay thế bằng Xác thực kép Biển số + SĐT (để gọi điện thoại trực tiếp khi cần) và gửi mã OTP qua Gmail App Password hoàn toàn hợp pháp, miễn phí 100%, bảo mật cao, và có thể live demo thực tế gửi thẳng vào hòm thư ban giám khảo để kiểm chứng."
* **Bước 249: Chiến lược Trả lời Câu hỏi Phản biện 3: "Tại sao không thu tiền trước khi sửa xe và tại sao không dùng cơ chế giữ kho 15 phút kiểu sàn thương mại điện tử?"**:
  *Câu trả lời mẫu*: "Đây là bước đột phá về tư duy thiết kế sát thực tế dịch vụ ô tô:
  * Trong thực tế vận hành Gara, khách hàng không bao giờ thanh toán trước khi thợ sửa chữa. Thời gian thợ tháo rã máy móc, tiện láng đĩa phanh và lắp ráp hoàn thiện kéo dài 1 - 3 giờ, do đó cơ chế 'giữ kho 15 phút rồi tự động xả' của các sàn thương mại điện tử (flash-sale) hoàn toàn vô lý và phản nghiệp vụ (không thể nhả kho khi xe đang tháo dở trên cầu nâng).
  * Dự án tách biệt rạch ròi 2 thời điểm then chốt:
    1. Khi Khách duyệt báo giá (`APPROVED`): Dùng Redis Redlock (5s Mutex) để cấp phát vật lý phụ tùng ra cầu nâng cho thợ thi công. Phụ tùng được giữ cố định theo lệnh sửa chữa.
    2. Khi Sửa xong & Nghiệm thu KCS (`COMPLETED`): Hệ thống xuất bảng quyết toán, khách quét mã VietQR qua VNPay với thời hạn $T_{pay} = 10\text{ phút}$. Redis thiết lập Khóa Idempotency (`lock:payment:{order_code}`, TTL 10 phút) chống trừ tiền 2 lần hoặc quét mã trùng lặp. Khi VNPay IPN phản hồi `SUCCESS`, Outbox Relay trừ kho vĩnh viễn và xuất hóa đơn VAT điện tử bàn giao xe."
* **Bước 250: Hoàn tất Checklist & Tự tin Chinh phục Điểm 10/10**:
  Kiểm tra lần cuối: Mã nguồn đóng gói gọn gàng, tài liệu SRS chuẩn chỉ, cẩm nang 250 bước chi tiết từng lệnh, kịch bản thuyết trình tự tin, mạch lạc, sẵn sàng gây ấn tượng tuyệt đối với bất kỳ Hội đồng phản biện khó tính nào!

---

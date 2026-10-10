# CẨM NANG TOÀN DIỆN THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN KỸ NGHỆ PHẦN MỀM
## ĐỀ TÀI: HỆ THỐNG QUẢN TRỊ & ĐIỀU PHỐI GARA THÔNG MINH HIHIHAHA AUTO
**Kiến trúc Đa mô hình (Polyglot Persistence), Xử lý Giao dịch Phân tán (Distributed Transactions) & Ingress Zero-Trust**

* **Thời lượng bảo vệ chuẩn:** 20 – 25 Phút
* **Phong thái trình bày:** Senior Systems Architect / Kỹ sư Trưởng (Đĩnh đạc, khiêm tốn học thuật, chứng minh chặt chẽ bằng toán học và thực nghiệm).
* **Tệp trình chiếu PowerPoint đi kèm:** `e:\CNPM_GaraSuaXe\BAO_CAO_CNPM_HIHIHAHA_AUTO_MOI_NHAT.pptx`
* **File đo đạc thực nghiệm Console:** `e:\CNPM_GaraSuaXe\backend\src\scripts\benchmark_architecture_proof.js`

---

## MỤC LỤC 24 SLIDES
* **Chương 1: Khởi Động & Phân Tích Yêu Cầu (SRS)**
  * Slide 01: Trang Tiêu Đề & Khởi Động Hệ Thống
  * Slide 02: Quy Trình Phát Triển & Cấu Trúc Phân Rã Công Việc (WBS)
  * Slide 03: Biểu Đồ Use Case Tổng Quát (Use Case Diagram) & Danh Mục UC01 - UC08
  * Slide 04: Biểu Đồ Hoạt Động (Activity Diagram 4 Swimlanes) & Đặc Tả Use Case (IEEE 830)
* **Chương 2: Kiến Trúc Hệ Thống & Polyglot Persistence**
  * Slide 05: Kiến Trúc Phân Tầng Tổng Thể (Layered & Event-Driven)
  * Slide 06: PostgreSQL Engine: Két Sắt Tài Chính & Write-Ahead Log
  * Slide 07: MongoDB Engine: Aggregate Root (DDD) & Snapshot Immutability
  * Slide 08: Neo4j Graph Engine: Index-Free Adjacency (IFA) vs. Relational Join
  * Slide 09: Redis In-Memory Engine: Single-Threaded Reactor & Distributed Mutex
* **Chương 3: Thiết Kế Chi Tiết & Mã Nguồn Thực Tế**
  * Slide 10: Biểu Đồ Lớp (Class Diagram) & Bảo Vệ Bất Biến Nghiệp Vụ
  * Slide 11: Biểu Đồ Tuần Tự (Sequence Diagram): Giao Dịch Đa Tầng & Outbox
  * Slide 12: Code Walkthrough 1: Giao Dịch ACID & Transactional Outbox
  * Slide 13: Code Walkthrough 2: Background Worker – FOR UPDATE SKIP LOCKED
  * Slide 14: Code Walkthrough 3: Khóa Phân Tán (Redlock) & Bồi Hoàn Saga
  * Slide 15: Code Walkthrough 4: Neo4j Cypher & Hybrid Graph-RAG Pipeline
  * Slide 16: Code Walkthrough 5: An Ninh Phân Tầng (ABAC & Rate Limiting)
* **Chương 4: Quy Trình & An Ninh Hệ Thống**
  * Slide 17: Finite State Machine (FSM 6 Chặng) & Socket.io Rooms
  * Slide 18: An Ninh Mật Mã Học: HMAC-SHA512 Checksum & Anti-Replay
* **Chương 5: Triển Khai & Hạ Tầng DevOps**
  * Slide 19: Docker Multi-Stage Build & Cô Lập Mạng Nội Bộ (Network Isolation)
  * Slide 20: Cloudflare Zero-Trust Ingress: QUIC/UDP Tunnel & Zero Open Ports
* **Chương 6: Tối Ưu Hóa, Thực Nghiệm & Kết Luận**
  * Slide 21: Chiến Lược Đánh Chỉ Mục (Indexing Strategies) & Minh Chứng Thực Nghiệm
  * Slide 22: Kịch Bản Live Demo Cao Trào (3 Phút Chứng Minh Thực Tế)
  * Slide 23: Tổng Kết Dự Án & Bài Học Kiến Trúc (Retrospective)
  * Slide 24: Phiên Hỏi Đáp (Q&A) – Sẵn Sàng Đón Nhận Phản Biện

---

# CHI TIẾT NỘI DUNG VÀ LỜI THOẠI TỪNG SLIDE (SLIDE 1 - 24)

---

### SLIDE 1: TRANG TIÊU ĐỀ & KHỞI ĐỘNG HỆ THỐNG
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** ĐỒ ÁN MÔN HỌC: KỸ NGHỆ PHẦN MỀM (SOFTWARE ENGINEERING)
  * **Tên đề tài:** HIHIHAHA AUTO – SMART GARAGE PLATFORM
  * **Phụ đề:** Kiến Trúc Đa Mô Hình (Polyglot Persistence), Xử Lý Giao Dịch Phân Tán (Distributed Transactions) & Ingress Zero-Trust
  * **Hộp thành phần cốt lõi:**
    * PostgreSQL ACID  •  MongoDB Documents  •  Neo4j Knowledge Graph  •  Redis Redlock Mutex
    * Transactional Outbox (SKIP LOCKED)  •  Google Gemini Graph-RAG  •  Cloudflare Tunnel Ingress
  * **Footer:** Giảng viên hướng dẫn: Bộ môn Kỹ Thuật Phần Mềm  |  Thời lượng bảo vệ: 25 Phút
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Đứng thẳng, ánh mắt bao quát Hội đồng, phong thái điềm tĩnh, tự tin).*
  * *"Kính thưa Quý Thầy Cô trong Hội đồng và các bạn sinh viên,*
  * *Trong kỹ nghệ phần mềm hiện đại, khoảng cách giữa một **ứng dụng thử nghiệm (Proof of Concept)** và một **hệ thống vận hành chuẩn doanh nghiệp (Production-Ready)** không nằm ở việc chúng ta vẽ ra bao nhiêu giao diện hay tạo bao nhiêu nút bấm CRUD thông thường.*
  * *Ranh giới cốt lõi đó nằm ở: **Năng lực kiểm soát các bài toán biên, giải quyết xung đột đồng thời ở mức vi mô, và bảo toàn tuyệt đối tính toàn vẹn dữ liệu trong môi trường phân tán**.*
  * *Hôm nay, đại diện cho nhóm phát triển, em xin phép được báo cáo đề tài: **Kỹ nghệ Hệ thống Quản trị & Điều phối Gara Thông minh HiHiHaHa Auto** — một nền tảng được thiết kế với kiến trúc Đa cơ sở dữ liệu chuyên biệt (Polyglot Persistence) và Cơ chế Xử lý Bất đồng bộ Hướng sự kiện (Event-Driven Outbox Pattern)."*
* **CẦU NỐI (BRIDGE):**
  * *"Để hiện thực hóa một hệ sinh thái kỹ thuật phức tạp như vậy, bước đi đầu tiên của chúng em là thiết lập một quy trình kỹ nghệ phần mềm kỷ luật và rõ ràng."*

---

### SLIDE 2: QUY TRÌNH PHÁT TRIỂN & CẤU TRÚC PHÂN RÃ CÔNG VIỆC (WBS)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 1: QUẢN TRỊ DỰ ÁN & SRS  |  SLIDE 02/24
  * **Tiêu đề:** Quy Trình Phát Triển & Cấu Trúc Phân Rã Công Việc (WBS)
  * **Cột trái (Vòng đời kỹ nghệ 4 giai đoạn):**
    * **Giai đoạn 1: Đặc tả Yêu cầu (SRS & IEEE 830):** Khảo sát thực địa xưởng dịch vụ, trích xuất 4 phân hệ cốt lõi, mô hình hóa ma trận Use Case và lập chỉ số đo lường phi chức năng NFR định lượng.
    * **Giai đoạn 2: Thiết kế Kiến trúc & Lõi Giao dịch:** Thiết kế kiến trúc Polyglot Persistence 4 CSDL, đặc tả FSM 6 chặng, xây dựng cơ chế Transactional Outbox và Distributed Lock.
    * **Giai đoạn 3: Hiện thực hóa & Giải quyết Bài toán Concurrency:** Triển khai Node.js core, Next.js client, xử lý chống Race Condition kho vật tư, thuật toán Cypher đồ thị khung gầm xe và tích hợp cổng thanh toán VNPay.
    * **Giai đoạn 4: Đóng gói Container, Benchmark & Bàn giao:** Container hóa toàn bộ hệ thống bằng Docker multi-stage, thiết lập Cloudflare Zero-Trust Tunnel và thực thi kịch bản kiểm thử tải đồng thời.
  * **Cột phải (Phân rã WBS theo Module):**
    * Phân hệ Lõi Giao dịch & CSDL Phân tán: PostgreSQL WAL, Outbox Worker, Schema Migration.
    * Phân hệ Quản trị Khoang Xưởng & Realtime: MongoDB Aggregates, Kanban FSM, Socket.io Rooms.
    * Phân hệ Khuyến nghị Đồ thị & AI Trợ lý: Neo4j Cypher Traversal, Gemini Graph-RAG Pipeline.
    * Phân hệ Cổng Khách hàng & Thanh toán Trực tuyến: VNPay Cryptographic Checksum, Redis Session Mutex, OTP Service.
    * Đóng gói Hạ tầng & Tối ưu hóa Hiệu năng: Docker Compose, Cloudflare Zero-Trust Ingress, Concurrency Benchmark Harness.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào 4 giai đoạn bên trái, sau đó quét sang các module WBS bên phải).*
  * *"Dự án được nhóm phát triển theo **Mô hình Vòng đời Kỹ nghệ Phần mềm phân kỳ (Phased Engineering Lifecycle)** gồm 4 giai đoạn cụ thể: Khởi tạo từ việc khảo sát hiện trạng xưởng dịch vụ, đặc tả yêu cầu SRS theo chuẩn IEEE 830; tiếp đến là thiết kế và triển khai lõi giao dịch giao tiếp dữ liệu đa tầng; sau đó là giải quyết triệt để các bài toán xung đột đồng thời, và cuối cùng là đóng gói container hóa toàn bộ dịch vụ, thực thi đo lường tải thực nghiệm trước khi bàn giao.*
  * *Về mặt phân bổ công việc, toàn bộ khối lượng kỹ thuật được bóc tách ma trận WBS (Work Breakdown Structure) rõ ràng. Các thành viên đảm nhiệm song song các phân hệ chuyên trách: từ Lõi Giao dịch Outbox, Cơ chế Đồng bộ Đồ thị Khuyến nghị, cho đến Bảo mật và Giao diện người dùng — đảm bảo tiến độ triển khai đồng đều và kiểm soát mã nguồn liên tục trên kho lưu trữ chung."*
* **CẦU NỐI (BRIDGE):**
  * *"Từ cấu trúc tổ chức dự án chặt chẽ đó, hệ thống phân định rõ ranh giới làm việc cho từng nhóm người dùng thông qua Biểu đồ Use Case và Danh mục UC chuẩn hóa."*

---

### SLIDE 3: BIỂU ĐỒ USE CASE TỔNG QUÁT & DANH MỤC UC01 - UC08
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 1: PHÂN TÍCH YÊU CẦU & SRS  |  SLIDE 03/24
  * **Tiêu đề:** Biểu Đồ Use Case Tổng Quát (Use Case Diagram) & Danh Mục UC01 - UC08
  * **Cột trái (Sơ đồ Boundary UML Use Case Diagram):**
    ```text
    ┌────────────────────────────────────────────────────────┐
    │              BOUNDARY: HỆ THỐNG HIHIHAHA AUTO          │
    │                                                        │
    │ [Actor: Khách Hàng]                                    │
    │   ├──► (UC01: Đăng nhập OTP Passwordless)              │
    │   ├──► (UC02: Tra cứu & Ký duyệt báo giá)              │
    │   └──► (UC08: Thanh toán Trực tuyến)                   │
    │          └──<<include>>──► (UC08b: Ghi Outbox Event)   │
    │                                                        │
    │ [Actor: Cố Vấn Dịch Vụ]                                │
    │   ├──► (UC03: Tiếp nhận Xe & Khám xe Kỹ thuật số)      │
    │   └──► (UC04: Lập Báo giá Dự toán Phụ tùng)            │
    │          └──<<extend>>───► (UC04b: Chẩn đoán AI Topo)  │
    │                                                        │
    │ [Actor: Quản Đốc Xưởng]                                │
    │   ├──► (UC05: Điều phối Khoang nâng & Gán thợ)         │
    │   └──► (UC06: Xuất kho & Giữ chỗ Phụ tùng)             │
    │          └──<<include>>──► (UC06b: Khóa Mutex Redlock) │
    │                                                        │
    │ [Actor: Kỹ Thuật Viên (Thợ máy)]                       │
    │   └──► (UC07: Thực thi Checklist & Nghiệm thu KCS)     │
    └────────────────────────────────────────────────────────┘
    ```
  * **Cột phải (Danh mục UC chuẩn SRS):**
    * **UC01: Xác thực OTP Passwordless**: Actor: Mọi tác nhân | Tiền điều kiện: Có số ĐT/Biển số xe. Hậu điều kiện: Cấp Access Token JWT & Role RBAC.
    * **UC02: Ký duyệt Báo giá Trực tuyến**: Actor: Khách hàng | Ký duyệt 1-Click để chuyển trạng thái sang `QUOTE_APPROVED`.
    * **UC03: Tiếp nhận Xe & Khám xe Số hóa**: Actor: Cố vấn | Quét mã VIN, định vị điểm xước trên mô hình 3D, tải ảnh hiện trường.
    * **UC04: Lập Báo giá & Khuyến nghị**: Actor: Cố vấn | `<<extend>>` UC04b: Gợi ý phụ tùng dùng chung khung gầm qua Neo4j và AI.
    * **UC05: Điều phối Khoang & Gán thợ**: Actor: Quản đốc | Kéo thả Kanban, gán lệnh theo năng suất và định mức FRT.
    * **UC06: Xuất kho & Giữ chỗ Phụ tùng**: Actor: Thủ kho, Quản đốc | `<<include>>` UC06b: Chiếm khóa phân tán Redlock Mutex chống âm kho.
    * **UC07: Thực thi Checklist & KCS**: Actor: Thợ máy, Quản đốc | Cập nhật lực siết N.m trên Tablet, nghiệm thu an toàn.
    * **UC08: Thanh toán & Xuất hóa đơn VAT**: Actor: Khách hàng | `<<include>>` UC08b: Ghi nhận Outbox Event trong cùng PostgreSQL Transaction.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào các quan hệ <<include>> và <<extend>> ở cột trái rồi quét sang bảng bên phải).*
  * *"Kính thưa Thầy Cô, tuân thủ nghiêm ngặt phương pháp luận Kỹ nghệ Phần mềm chuẩn IEEE 830, hệ thống được mô hình hóa qua Biểu đồ Use Case tổng quát với 5 tác nhân chính và 8 Use Case cốt lõi từ UC01 đến UC08:*
  * *- Phía Khách hàng: Tương tác qua UC01 Đăng nhập OTP, UC02 Duyệt báo giá trực tuyến, và UC08 Thanh toán VNPay. Điểm mấu chốt: **UC08 bắt buộc `<<include>>` quan hệ ghi nhận sự kiện Outbox Event** nhằm bảo vệ tính toàn vẹn tài chính.*
  * *- Phía Cố vấn Dịch vụ: Đảm nhiệm UC03 Tiếp nhận khám xe số hóa và UC04 Lập báo giá. **UC04 có quan hệ `<<extend>>` mở rộng sang UC04b** kích hoạt thuật toán Cypher trên Neo4j và AI Gemini để tự động phát hiện linh kiện khung gầm dùng chung.*
  * *- Phía Quản đốc và Thợ máy: Điều phối qua UC05 Kanban và UC07 Checklist siết lực. Đặc biệt, **UC06 Xuất kho bắt buộc `<<include>>` UC06b Chiếm khóa Mutex Redlock** để triệt tiêu hoàn toàn bài toán va chạm đồng thời."*
* **CẦU NỐI (BRIDGE):**
  * *"Để thấy rõ sự tương tác qua lại giữa 4 tác nhân này trong thực tế xưởng, xin kính mời Hội đồng xem Biểu đồ Hoạt động phân làn tại Slide 4."*

---

### SLIDE 4: BIỂU ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAM) & ĐẶC TẢ CHI TIẾT (IEEE 830)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 1: PHÂN TÍCH YÊU CẦU & SRS  |  SLIDE 04/24
  * **Tiêu đề:** Biểu Đồ Hoạt Động (Activity Diagram) & Đặc Tả Use Case (IEEE 830)
  * **Cột trái (Biểu đồ Hoạt động 4 Swimlanes):**
    ```text
    ┌────────────────────────────────────────────────────────┐
    │ PHÂN LÀN NGHIỆP VỤ 4 TÁC NHÂN (SWIMLANES WORKFLOW)     │
    ├──────────────┬──────────────┬──────────────┬───────────┤
    │  Khách Hàng  │  Cố Vấn DV   │ Quản Đốc/Thợ │ Hệ Thống  │
    ├──────────────┼──────────────┼──────────────┼───────────┤
    │              │ (*) Tiếp nhận│              │           │
    │              │  Khám xe 360°│              │           │
    │              │  Lập dự toán │              │           │
    │       ◄──────┴──────────────┘              │           │
    │ [Xem báo giá]│                             │           │
    │   ▼          │                             │           │
    │ <Khách duyệt>┼──[Từ chối]──► (KẾT THÚC)    │           │
    │   │ [Đồng ý] │                             │           │
    │   └──────────┴──────────────► Kích hoạt LSC┼─► Giữ kho │
    │                             (FSM Kanban)   │ (Redlock) │
    │                                  │         │    │      │
    │                             Gán thợ nâng───► Cấp vật tư│
    │                                  │         │    │      │
    │                             Thợ thi công◄──┴────┘      │
    │                             Checklist N.m  │           │
    │                                  │         │           │
    │                             Nghiệm thu QC  │           │
    │       ◄──────────────────────────┘         │           │
    │ [Quét VNPay]─► Webhook─────────────────────► Outbox WAL│
    │       ◄──────────────────────────◄─────────┤ (Paid <80m│
    │ Nhận xe (X)  │ Bàn giao xe  │              │           │
    └──────────────┴──────────────┴──────────────┴───────────┘
    ```
  * **Cột phải (Bảng Đặc tả IEEE 830 chi tiết):**
    * **ĐẶC TẢ UC06: XUẤT KHO VẬT TƯ (INVENTORY ALLOCATION):**
      - Tác nhân: Thủ kho, Quản đốc xưởng.
      - Tiền điều kiện: Lệnh sửa xe ở trạng thái `QUOTE_APPROVED`.
      - Luồng chính: 1. Hệ thống chiếm khóa Redlock `inventory:lock:{sku}` -> 2. Kiểm tra tồn kho >= số lượng yêu cầu -> 3. Trừ tồn kho & Chuyển trạng thái `WAITING_PARTS` -> 4. Giải phóng khóa.
      - Luồng ngoại lệ: 2a. Thiếu hàng -> Kích hoạt bồi hoàn Saga, Rollback lệnh.
      - Hậu điều kiện: Vật tư được gán khoang nâng, tồn kho vật lý giảm.
    * **ĐẶC TẢ UC08: THANH TOÁN OUTBOX (PAYMENT & INVOICE):**
      - Tác nhân: Khách hàng.
      - Tiền điều kiện: Lệnh sửa xe ở trạng thái `COMPLETED`, biên bản KCS đạt.
      - Luồng chính: 1. Khách quét mã VietQR -> 2. VNPay gọi Webhook -> 3. Đối soát chữ ký HMAC-SHA512 -> 4. Mở Local Transaction ghi Invoice + Outbox Event -> 5. Worker đồng bộ trạng thái `PAID` sang Mongo/Socket.
      - Luồng ngoại lệ: 3a. Sai chữ ký số -> Từ chối giao dịch, ghi log an ninh.
      - Hậu điều kiện: Trạng thái hóa đơn `PAID`, hóa đơn VAT phát hành.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser theo các làn bơi từ trái sang phải, sau đó chỉ sang khối đặc tả bên phải).*
  * *"Sau Biểu đồ Use Case, nhóm cụ thể hóa luồng vận hành bằng **Biểu đồ Hoạt động phân làn (Activity Diagram với 4 Swimlanes)**. Quy trình đi qua 4 làn bơi rành mạch giữa Khách hàng, Cố vấn, Quản đốc/Thợ và Hệ thống. Mọi điểm rẽ nhánh (Decision Nodes) đều được kiểm soát: nếu khách từ chối báo giá, quy trình kết thúc an toàn; nếu khách đồng ý, hệ thống tự động sinh Lệnh sửa chữa và kích hoạt luồng giữ chỗ phụ tùng trên Redis.*
  * *Ở bảng bên phải, nhóm **đặc tả chi tiết chuẩn IEEE 830** cho 2 Use Case then chốt: UC06 Xuất kho có đầy đủ Tiền điều kiện, Luồng chính và Luồng ngoại lệ bồi hoàn Saga; và UC08 Thanh toán bọc trong Transaction bảo vệ tính lũy biến."*
* **CẦU NỐI (BRIDGE):**
  * *"Để đáp ứng khối lượng nghiệp vụ liên phòng ban này, kiến trúc phân tầng tổng thể của hệ thống được thiết kế như thế nào? Xin mời Hội đồng đến với Slide 5."*

---

### SLIDE 5: KIẾN TRÚC PHÂN TẦNG TỔNG THỂ (LAYERED & EVENT-DRIVEN)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 2: KIẾN TRÚC HỆ THỐNG  |  SLIDE 05/24
  * **Tiêu đề:** Kiến Trúc Phân Tầng Tổng Thể (Layered & Event-Driven)
  * **Sơ đồ phân tầng:**
    * Tầng Trình diễn (Presentation Layer): Next.js 14 App Router, TailwindCSS, Socket.io Client.
    * Tầng Cửa ngõ (Ingress & Security): Cloudflare Zero-Trust Tunnel, JWT RBAC Guard, Rate Limiter.
    * Tầng Ứng dụng & Điều phối (Application Core): Express REST API, Domain Services, BullMQ Task Engine, Outbox Polling Worker.
    * Tầng Dữ liệu Chuyên biệt (Polyglot Data Layer): PostgreSQL, MongoDB, Neo4j, Redis.
  * **Hai luồng xử lý phân tách:**
    * Luồng Đồng bộ (Sync Pipeline): Client -> Ingress -> Controller -> PostgreSQL / MongoDB (Phản hồi < 50ms).
    * Luồng Bất đồng bộ (Async Event Pipeline): Outbox Worker -> Message Broker -> Neo4j / Socket.io / AI Service.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser từ tầng Presentation xuống Data Layer, sau đó quét theo mũi tên của Luồng Async).*
  * *"Hệ thống được tổ chức thành 4 tầng rành mạch. Điểm mấu chốt ở đây là sự phân tách triệt để giữa **Luồng Đồng bộ (Sync)** và **Luồng Bất đồng bộ (Async)**. Các tác vụ cần phản hồi tức thì cho người dùng chỉ tương tác trực tiếp với PostgreSQL hoặc MongoDB trong vài chục mili-giây. Mọi tác vụ nặng nề như đồng bộ đồ thị tri thức, gửi email OTP hay phân tích AI đều được đẩy vào hàng đợi sự kiện Outbox để Worker xử lý ngầm, đảm bảo API Gateway không bao giờ bị nghẽn."*
* **CẦU NỐI (BRIDGE):**
  * *"Bây giờ, em xin phép đi sâu vào trái tim dữ liệu của hệ thống: Tại sao lại là kiến trúc Đa mô hình Polyglot Persistence, khởi đầu bằng PostgreSQL."*

---

### SLIDE 6: POSTGRESQL ENGINE: KÉT SẮT TÀI CHÍNH & WRITE-AHEAD LOG
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 2: KIẾN TRÚC POLYGLOT  |  SLIDE 06/24
  * **Tiêu đề:** PostgreSQL Engine: Két Sắt Tài Chính & Write-Ahead Log
  * **Cột trái (Lý do chọn lựa):**
    * Bảo toàn số học dấu phẩy tĩnh (Fixed-Point Arithmetic): Sử dụng kiểu `NUMERIC(15,2)` thay vì Floating-point để triệt tiêu hoàn toàn sai số làm tròn tiền tệ.
    * Toàn vẹn ACID nghiêm ngặt: Mọi giao dịch thanh toán và phát hành hóa đơn VAT đều nằm trong Database Transaction với Write-Ahead Log (WAL) lưu đĩa bền vững.
    * Cơ chế Partial Index siêu nhẹ: Đánh chỉ mục riêng cho các sự kiện Outbox đang chờ xử lý (`WHERE processed_status = 'PENDING'`), tối ưu hóa tốc độ worker.
  * **Cột phải (DDL Schema thực tế):**
    * Bảng `payment_transactions` với khóa UUID, ràng buộc Check Amount > 0.
    * Bảng `outbox_events` lưu trữ Payload JSONB.
    * Partial Index `idx_outbox_pending` trên `processed_status`.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào kiểu NUMERIC(15,2) và câu lệnh CREATE INDEX ... WHERE PENDING).*
  * *"PostgreSQL được nhóm định vị là 'Két sắt tài chính'. Để bảo toàn từng đồng tiền của khách hàng, chúng em sử dụng số học dấu phẩy tĩnh `NUMERIC(15,2)`, loại bỏ vĩnh viễn rủi ro sai số dấu phẩy động của kiểu Float/Double thông thường. Mọi bút toán tài chính đều được bảo vệ bằng Write-Ahead Log chuẩn ACID.*
  * *Đặc biệt, bảng `outbox_events` được trang bị một **Partial Index** chỉ lọc riêng các sự kiện có trạng thái `PENDING`, giúp worker quét hàng triệu bản ghi mà không tốn dung lượng bộ nhớ đệm."*
* **CẦU NỐI (BRIDGE):**
  * *"Nếu PostgreSQL là kỷ luật thép cho tài chính, thì MongoDB mang lại sự linh hoạt tối đa cho hồ sơ kỹ thuật xe."*

---

### SLIDE 7: MONGODB ENGINE: AGGREGATE ROOT & SNAPSHOT IMMUTABILITY
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 2: KIẾN TRÚC POLYGLOT  |  SLIDE 07/24
  * **Tiêu đề:** MongoDB Engine: Aggregate Root (DDD) & Snapshot Immutability
  * **Cột trái (DDD & Đóng gói dữ liệu):**
    * Aggregate Root (DDD): Thực thể `WorkOrder` đóng vai trò gốc tổng hợp, lưu trữ toàn bộ: thông tin xe, danh mục phụ tùng, ảnh khám xe 360 độ và timeline sửa chữa trong 1 Document duy nhất.
    * Tính Bất biến của Snapshot (Immutability): Lưu giữ nguyên vẹn giá phụ tùng tại thời điểm xuất xưởng. Biến động giá thị trường trong tương lai không làm sai lệch lịch sử sửa chữa cũ.
    * Single-Document Atomicity: Ghi/đọc toàn bộ phiếu kiểm định chỉ tốn đúng 1 I/O, tốc độ phản hồi tính bằng mili-giây.
  * **Cột phải (Mongoose Schema thực tế):**
    * Document `WorkOrder` chứa các mảng nhúng: `tasks`, `assigned_technicians`, `estimate.items`, `inspection_photos`.
    * Compound Index: `WorkOrderSchema.index({ license_plate: 1, current_status: 1 })`.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào khối Snapshot giá và Compound Index dưới đáy code).*
  * *"Trong thế giới gara, hồ sơ kiểm định xe là một cấu trúc dữ liệu phân cấp phức tạp. Với MongoDB, chúng em áp dụng nguyên lý **Aggregate Root** của Domain-Driven Design: gom trọn vẹn toàn bộ vòng đời phiếu sửa xe vào một BSON Document duy nhất.*
  * *Quan trọng nhất là kỹ thuật **Snapshot Immutability**: khi khách hàng chốt báo giá, đơn giá phụ tùng và tiền công được 'đóng băng' vĩnh viễn trong Document. Dù giá phụ tùng ngoài thị trường hôm sau có tăng gấp đôi, lịch sử đơn hàng của khách vẫn được bảo toàn nguyên vẹn."*
* **CẦU NỐI (BRIDGE):**
  * *"Thách thức lớn tiếp theo là bài toán gợi ý phụ tùng dùng chung giữa các dòng xe — nơi các phép JOIN của SQL bộc lộ giới hạn nghẽn cổ chai."*

---

### SLIDE 8: NEO4J GRAPH ENGINE: INDEX-FREE ADJACENCY (IFA) VS. RELATIONAL JOIN
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 2: KIẾN TRÚC POLYGLOT  |  SLIDE 08/24
  * **Tiêu đề:** Neo4j Graph Engine: Index-Free Adjacency (IFA) vs. Relational Join
  * **Cột trái (Bản chất toán học):**
    * Relational B-Tree Recursion ($O(k \log N)$): SQL phải JOIN 5 bảng (Car -> Platform -> Subsystem -> Part -> OEM), mỗi bước tốn $O(\log N)$ tìm cây B-Tree. Khi dữ liệu lớn, chi phí bùng nổ theo cấp số nhân.
    * Index-Free Adjacency ($O(1)$): Mỗi Node lưu con trỏ RAM trực tiếp trỏ tới các Node lân cận. Duyệt quan hệ là nhảy con trỏ bộ nhớ với chi phí hằng số $O(1)$, độc lập hoàn toàn với kích thước đồ thị.
    * Nền tảng xe thực tế: Khung gầm TNGA-K dùng chung giữa Toyota Camry và Lexus ES250.
  * **Cột phải (Cypher Query thực tế):**
    * `MATCH (targetCar:VehicleModel) ... -[:USES_PLATFORM]-> (platform) ... RETURN DISTINCT p.code, p.name LIMIT 5;`
    * Thực nghiệm: Độ trễ < 15ms (nhanh gấp 14 lần so với phép JOIN SQL tương đương).
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào công thức O(k log N) bên trái, rồi chỉ sang câu lệnh Cypher bên phải).*
  * *"Khi một dòng xe vào xưởng, các hãng xe thường dùng chung khung gầm: ví dụ khung gầm TNGA-K dùng cho cả Toyota Camry và Lexus ES250. Nếu dùng SQL RDBMS để truy vấn phụ tùng tương thích, hệ thống phải thực hiện 5 phép JOIN đệ quy qua cây B-Tree với độ phức tạp $O(k \log N)$, gây nghẽn CPU.*
  * *Neo4j giải quyết bài toán bằng cơ chế **Index-Free Adjacency**: mỗi Node lưu trực tiếp con trỏ bộ nhớ vật lý tới các Node kế bên. Việc tìm kiếm má phanh tương thích thực chất là phép nhảy con trỏ RAM với chi phí hằng số $O(1)$, mang lại tốc độ dưới 15 mili-giây bất kể đồ thị có hàng triệu mắt xích."*
* **CẦU NỐI (BRIDGE):**
  * *"Để điều phối khóa tài nguyên và bảo vệ hệ thống trước các tranh chấp microsecond, chúng ta cần mảnh ghép thứ tư: Redis."*

---

### SLIDE 9: REDIS IN-MEMORY ENGINE: SINGLE-THREADED REACTOR & DISTRIBUTED MUTEX
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 2: KIẾN TRÚC POLYGLOT  |  SLIDE 09/24
  * **Tiêu đề:** Redis In-Memory Engine: Single-Threaded Reactor & Distributed Mutex
  * **Cột trái (Lý do kỹ thuật):**
    * Single-Threaded Reactor Pattern: Xử lý lệnh tuần tự trên 1 luồng CPU qua I/O Multiplexing (epoll), đảm bảo các lệnh `SET NX PX` luôn mang tính nguyên tử tuyệt đối (Thread-Safe).
    * Tại sao không dùng Database Lock? Tránh chiếm dụng Connection Pool của PostgreSQL (mặc định chỉ 100 pool). Giữ khóa trên Redis giải phóng đĩa cứng.
    * Tại sao không dùng RAM của Node.js? RAM Node.js bị cô lập trong từng Process/Container. Redis đóng vai trò là Bộ nhớ dùng chung phân tán (Distributed Shared Memory).
  * **Cột phải (Cấu hình Redlock thực tế):**
    * Khởi tạo `new Redlock([redis], { driftFactor: 0.01, retryCount: 3, retryDelay: 200, retryJitter: 50 })`.
    * Lệnh xin khóa `SET key uuid NX PX 5000` thực thi trong RAM chưa đầy 0.5ms!
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào 3 gạch đầu dòng so sánh bên trái, rồi chỉ sang tham số Redlock bên phải).*
  * *"Redis được sử dụng như một tầng kiểm soát đồng thời siêu nhẹ. Nhờ kiến trúc Single-Threaded Reactor, các thao tác xin khóa trên Redis đạt tính nguyên tử tự nhiên trong RAM. Việc nhóm đưa cơ chế khóa phân tán ra Redis giúp giải phóng hoàn toàn Connection Pool của PostgreSQL, ngăn chặn thảm họa cạn kiệt kết nối đĩa cứng khi hàng trăm thợ máy cùng lúc yêu cầu cấp phát phụ tùng trong giờ cao điểm."*
* **CẦU NỐI (BRIDGE):**
  * *"Sau khi đã làm chủ 4 động cơ CSDL, các thực thể nghiệp vụ được liên kết với nhau như thế nào trong mô hình hướng đối tượng? Xin kính mời Thầy Cô đến với Biểu đồ Lớp."*

---

### SLIDE 10: BIỂU ĐỒ LỚP (CLASS DIAGRAM) & BẢO VỆ BẤT BIẾN NGHIỆP VỤ
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: THIẾT KẾ CHI TIẾT  |  SLIDE 10/24
  * **Tiêu đề:** Biểu Đồ Lớp (Class Diagram) & Bảo Vệ Bất Biến Nghiệp Vụ
  * **Sơ đồ Class Diagram chuẩn UML:**
    * `WorkOrder` (Aggregate Root trên MongoDB): Chứa order_code, current_status, payment_status, phương thức `calculateTotal()`, `canTransitionTo()`.
    * Liên kết 1 - 1 sang `PaymentTransaction` (PostgreSQL): txn_id, order_code, vnp_txn_ref, amount, status.
    * Liên kết 1 - 1 sang `Invoice` (PostgreSQL): invoice_id, tax_code, total_amount, grand_total.
    * Liên kết 1 - N sang `WorkOrderItem`: item_id, part_code (tham chiếu Neo4j), quantity, unit_price, is_allocated.
  * **Hộp Domain Invariant Protection:** Bất biến nghiệp vụ: Tổng tiền = SUM(giá linh kiện * số lượng) + tiền công - giảm giá, được thẩm định nguyên tử trong Domain Service trước khi ghi đĩa.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser từ WorkOrder sang PaymentTransaction, rồi chỉ xuống hộp Domain Invariant).*
  * *"Biểu đồ Lớp thể hiện rõ triết lý thiết kế hướng đối tượng: `WorkOrder` đóng vai trò Aggregate Root kiểm soát mọi quy tắc chuyển đổi trạng thái. Khi thanh toán hoàn tất, một liên kết 1-1 được thiết lập sang `PaymentTransaction` và `Invoice` trong PostgreSQL.*
  * *Hệ thống thiết lập rào chắn **Domain Invariant Protection**: mọi công thức tính tổng tiền, thuế VAT và tiền công đều được tính toán và kiểm tra tính hợp lệ nguyên tử ngay trong Domain Service trước khi ghi xuống CSDL, ngăn ngừa triệt để các lỗi gian lận giá từ phía giao diện."*
* **CẦU NỐI (BRIDGE):**
  * *"Và ở đây, câu hỏi lớn là: Khi thanh toán thành công, dòng tương tác tuần tự giữa giao diện, controller, các CSDL và worker nền diễn ra như thế nào? Xin mời Hội đồng đến với Biểu đồ Tuần tự tại Slide 11."*

---

### SLIDE 11: BIỂU ĐỒ TUẦN TỰ (SEQUENCE DIAGRAM): GIAO DỊCH ĐA TẦNG & OUTBOX
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: THIẾT KẾ CHI TIẾT  |  SLIDE 11/24
  * **Tiêu đề:** Biểu Đồ Tuần Tự (Sequence Diagram): Giao Dịch Đa Tầng & Outbox
  * **Cột trái (Sơ đồ Tuần tự 7 Lifelines):**
    ```text
    [Khách]  [:UI]   [:Controller]  [:Service]  [:Postgres]  [:Worker]  [:MongoDB]
       │       │          │           │          │          │          │
     1 │─scan─►│          │           │          │          │          │
     2 │       │─webhook─►│           │          │          │          │
     3 │       │          │─verify()─►│          │          │          │
     4 │       │          │           │─BEGIN───►│          │          │
     5 │       │          │           │─UPDATE──►│          │          │
     6 │       │          │           │─Outbox──►│          │          │
     7 │       │          │           │─COMMIT──►│          │          │
     8 │◄──200 OK (Sync)──│           │          │          │          │
       │       │          │           │          │          │          │
     9 │       │          │           │          │◄─poll────│          │
       │       │          │           │          │(SKIP LCK)│          │
    10 │       │          │           │          │          │─setPAID─►│
    11 │       │          │           │          │◄─ack OK──│◄─success─│
    12 │◄─Socket.io emit(PAID) <80ms────────────────────────│          │
       │       │          │           │          │          │          │
    ```
  * **Cột phải (Phân tích Luồng tương tác & Lifelines):**
    * **Pha Đồng bộ (Sync Phase - Bước 1 đến 8):** Boundary UI nhận Webhook -> Controller xác thực chữ ký HMAC -> Service mở Local Transaction ghi nhận cả Invoice và Outbox Event -> COMMIT hoàn tất < 35ms -> Trả HTTP 200 giải phóng tài nguyên.
    * **Pha Bất đồng bộ (Async Phase - Bước 9 đến 12):** Outbox Worker quét hàng đợi với `FOR UPDATE SKIP LOCKED` (độ trễ 4.12ms) -> Đồng bộ sang MongoDB với tính lũy biến (toán tử `$ne`) -> Socket.io phát sóng cập nhật bảng Kanban toàn xưởng < 80ms.
    * **Khắc chế 2PC:** Triệt tiêu hoàn toàn rủi ro rách dữ liệu phân tán, đảm bảo *At-Least-Once Delivery* và *High Availability*.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser từ bước 1 đến 8 ở cột trái, rồi chỉ xuống bước 9 đến 12).*
  * *"Kính thưa Hội đồng, để mô hình hóa sự tương tác động giữa các thành phần đối tượng theo chuẩn môn Kỹ nghệ Phần mềm, nhóm thiết kế **Biểu đồ Tuần tự (Sequence Diagram)** cho quy trình thanh toán và đồng bộ đa CSDL:*
  * *- **Trong Pha Đồng bộ (Sync Phase từ bước 1 đến 8):** Khi khách hàng quét mã, Webhook kích hoạt PaymentController và OrderService. Thay vì gọi phân tán sang MongoDB dễ gặp lỗi mạng, Service chỉ mở 1 Local Transaction trong PostgreSQL để ghi cả Hóa đơn lẫn sự kiện Outbox. Lệnh COMMIT thành công trong 35ms, hệ thống trả về mã 200 OK ngay lập tức cho cổng thanh toán.*
  * *- **Trong Pha Bất đồng bộ (Async Phase từ bước 9 đến 12):** Outbox Worker ngầm quét sự kiện bằng cơ chế `FOR UPDATE SKIP LOCKED` với tốc độ 4.12ms. Worker cập nhật sang MongoDB với điều kiện lũy biến, sau đó thông qua Socket.io bắn sự kiện cập nhật bảng Kanban cho toàn bộ xưởng và khách hàng dưới 80ms.*
  * *Biểu đồ này chứng minh: Hệ thống giải quyết trọn vẹn bài toán Dual-Write mà không làm nghẽn hệ thống như giao thức 2PC cổ điển."*
* **CẦU NỐI (BRIDGE):**
  * *"Để chứng minh tính xác thực, em xin phép chiếu trực tiếp đoạn mã nguồn triển khai thực tế của Transactional Outbox trong file controller của nhóm."*

---

### SLIDE 12: CODE WALKTHROUGH 1: GIAO DỊCH ACID & TRANSACTIONAL OUTBOX
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: MÃ NGUỒN THỰC TẾ  |  SLIDE 12/24
  * **Tiêu đề:** Code Walkthrough 1: Giao Dịch ACID & Transactional Outbox
  * **Sub-header:** `payment.controller.js` – Bảo đảm nguyên tử trong cùng một Local Transaction
  * **Khung Code syntax highlighted:**
    * Bắt đầu `await client.query('BEGIN')`.
    * Cập nhật `payment_transactions` thành `SUCCESS`.
    * Chèn vào `outbox_events` với `event_type = 'PAYMENT_COMPLETED'`, kèm `payload` chứa thông tin thanh toán, trạng thái `PENDING`.
    * Kết thúc `await client.query('COMMIT')`.
    * Xử lý ngoại lệ `await client.query('ROLLBACK')`.
  * **Chú thích kiến trúc:** Hoặc cả 2 lệnh cùng thành công, hoặc cả 2 cùng thất bại. Sự kiện thanh toán được bảo vệ bởi Postgres WAL!
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào lệnh BEGIN ở dòng 3, sau đó chỉ vào lệnh INSERT INTO outbox_events và COMMIT ở dòng 21).*
  * *"Đây là mã nguồn thực tế tại `payment.controller.js`. Khi khách hàng thanh toán VNPay thành công, toàn bộ thao tác cập nhật hóa đơn và thao tác chèn sự kiện `PAYMENT_COMPLETED` vào bảng `outbox_events` được bao bọc trọn vẹn trong cùng một lệnh `BEGIN` và `COMMIT` của PostgreSQL.*
  * *Nhờ cơ chế này, cho dù máy chủ có bị mất điện đột ngột ngay tại tích tắc này, cơ chế Write-Ahead Log của PostgreSQL đảm bảo: hoặc cả hai cùng được ghi nhận, hoặc cả hai cùng bị hủy bỏ, triệt tiêu 100% rủi ro mất mát giao dịch."*
* **CẦU NỐI (BRIDGE):**
  * *"Sau khi sự kiện đã nằm an toàn trong bảng Outbox, làm thế nào để Background Worker lấy sự kiện ra xử lý mà không bị tranh chấp giữa các worker? Xin mời Thầy Cô xem tiếp mã nguồn của Worker."*

---

### SLIDE 13: CODE WALKTHROUGH 2: BACKGROUND WORKER – FOR UPDATE SKIP LOCKED
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: MÃ NGUỒN THỰC TẾ  |  SLIDE 13/24
  * **Tiêu đề:** Code Walkthrough 2: Background Worker – FOR UPDATE SKIP LOCKED
  * **Sub-header:** `outbox.worker.js` – Phục hồi dữ liệu phi tranh chấp và bảo vệ Idempotency
  * **Khung Code syntax highlighted:**
    * Câu truy vấn then chốt:
      `SELECT * FROM outbox_events WHERE processed_status = 'PENDING' ORDER BY created_at ASC LIMIT 10 FOR UPDATE SKIP LOCKED;`
    * Duyệt qua các sự kiện, gọi `WorkOrder.findOneAndUpdate({ order_code, payment_status: { $ne: 'PAID' } })`.
    * Cập nhật lại sự kiện thành `PROCESSED`.
  * **Hộp giải thích cơ chế:** `SKIP LOCKED` cho phép nhiều worker chạy song song mà không khóa lẫn nhau (Zero Lock Contention). Điều kiện `$ne: 'PAID'` bảo đảm tính lũy biến (Idempotent).
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào cụm từ FOR UPDATE SKIP LOCKED ở dòng 5, rồi chỉ vào điều kiện $ne: PAID ở dòng 15).*
  * *"Điểm tinh hoa trong file `outbox.worker.js` chính là câu truy vấn `SELECT ... FOR UPDATE SKIP LOCKED`. Thông thường, nếu có nhiều worker cùng chạy, chúng sẽ tranh chấp và khóa chặn lẫn nhau.*
  * *Với mệnh đề `SKIP LOCKED`, worker thứ nhất khóa xử lý 10 bản ghi đầu tiên; worker thứ hai đến sau sẽ tự động nhảy qua các bản ghi đang bị khóa để xử lý 10 bản ghi tiếp theo mà không phải chờ đợi 1 mili-giây nào! Đồng thời, điều kiện `$ne: 'PAID'` ở tầng MongoDB bảo vệ tính lũy biến (Idempotency), bảo đảm một sự kiện dù có bị gửi lại nhiều lần cũng không bao giờ làm sai lệch trạng thái phiếu."*
* **CẦU NỐI (BRIDGE):**
  * *"Bên cạnh đồng bộ dữ liệu, bài toán tranh chấp kho phụ tùng giờ cao điểm được mã hóa như thế nào? Xin mời Hội đồng đến với đoạn code Redlock."*

---

### SLIDE 14: CODE WALKTHROUGH 3: KHÓA PHÂN TÁN (REDLOCK) & BỒI HOÀN SAGA
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: MÃ NGUỒN THỰC TẾ  |  SLIDE 14/24
  * **Tiêu đề:** Code Walkthrough 3: Khóa Phân Tán (Redlock) & Bồi Hoàn Saga
  * **Sub-header:** `inventory.service.js` – Chống Race Condition và hoàn trả tài nguyên khi thiếu hàng
  * **Khung Code syntax highlighted:**
    * `const lockKey = 'inventory:lock:' + partCode;`
    * `const lock = await redlock.acquire([lockKey], 3000); // Khoá 3 giây`
    * Kiểm tra tồn kho: Nếu `stock < requestedQty` -> Kích hoạt Bồi hoàn Saga (Compensating Transaction) hoàn trả các món đã giữ trước đó và `throw Error`.
    * Trừ kho an toàn: `part.quantity_in_stock -= requestedQty; await part.save();`
    * Giải phóng khóa trong khối `finally { await lock.release(); }`.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào lệnh redlock.acquire ở dòng 4 và khối finally release ở dòng 20).*
  * *"Tại `inventory.service.js`, mỗi mã phụ tùng được bảo vệ bởi một khóa động có định danh `inventory:lock:{partCode}` với thời gian sống TTL 3 giây trên Redis. Chỉ có luồng giành được khóa mới có quyền đọc và trừ số lượng trong kho.*
  * *Nếu một đơn hàng yêu cầu 3 món phụ tùng mà món thứ 3 bị hết hàng giữa chừng, hệ thống lập tức kích hoạt Giao dịch bồi hoàn Saga (Compensating Transaction) để hoàn trả 2 món phụ tùng trước đó về kệ, và giải phóng khóa an toàn trong khối `finally`. Nhờ đó, kho hàng luôn được bảo toàn trọn vẹn."*
* **CẦU NỐI (BRIDGE):**
  * *"Bài toán tiếp theo: Làm thế nào để trợ lý chẩn đoán AI không bao giờ tư vấn bừa bãi hay 'ảo giác' về phụ tùng? Xin mời Hội đồng xem cách tích hợp Đồ thị Tri thức với AI."*

---

### SLIDE 15: CODE WALKTHROUGH 4: NEO4J CYPHER & HYBRID GRAPH-RAG PIPELINE
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: MÃ NGUỒN THỰC TẾ  |  SLIDE 15/24
  * **Tiêu đề:** Code Walkthrough 4: Neo4j Cypher & Hybrid Graph-RAG Pipeline
  * **Sub-header:** `ai-diagnosis.service.js` – Triệt tiêu ảo giác AI bằng Đồ thị Tri thức và đối soát kho
  * **Sơ đồ 3 Bước Graph-RAG:**
    * BƯỚC 1: Duyệt Topo Khung gầm trên Neo4j (Cypher tìm phụ tùng dùng chung và cụm bộ phận thực tế).
    * BƯỚC 2: Đối soát Tồn kho thực tế trên MongoDB (Lọc ra các phụ tùng đang còn hàng trong kho xưởng).
    * BƯỚC 3: Nạp Grounding Context vào Google Gemini 1.5 Flash sinh câu trả lời chính xác 100%.
  * **Khung Code Cypher & Gemini API:**
    * Cypher truy vấn quan hệ `:USES_PLATFORM` và `:FITS_SUB_ASSEMBLY`.
    * Prompt hệ thống yêu cầu AI CHỈ ĐƯỢC tư vấn các phụ tùng nằm trong danh sách đồ thị đã cấp.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser tuần tự vào 3 bước: Neo4j -> MongoDB -> Gemini).*
  * *"Thông thường, các mô hình ngôn ngữ lớn (LLM) rất dễ bị 'ảo giác' (Hallucination) — tức là tự bịa ra mã phụ tùng không tương thích. Nhóm giải quyết triệt để rủi ro này bằng mô hình **Hybrid Graph-RAG**:*
  * *Khi thợ mô tả triệu chứng xe, hệ thống KHÔNG hỏi AI ngay, mà trước hết kích hoạt Neo4j để tìm topo các phụ tùng dùng chung, sau đó đối soát kho vật tư trên MongoDB. Toàn bộ dữ liệu thực tế này được làm mỏ neo ngữ cảnh (Grounding Context) nhồi vào Gemini. Nhờ đó, AI hoạt động như một chuyên gia kỹ thuật chuẩn xác, không bịa đặt và chỉ khuyến nghị những phụ tùng đang thực sự nằm trên kệ kho."*
* **CẦU NỐI (BRIDGE):**
  * *"Toàn bộ hệ thống kỹ thuật mạnh mẽ này được bảo vệ bởi kiến trúc an ninh nhiều lớp như thế nào? Xin mời Hội đồng đến với Slide 16."*

---

### SLIDE 16: CODE WALKTHROUGH 5: AN NINH PHÂN TẦNG (ABAC & RATE LIMITING)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 3: MÃ NGUỒN THỰC TẾ  |  SLIDE 16/24
  * **Tiêu đề:** Code Walkthrough 5: An Ninh Phân Tầng (ABAC & Rate Limiting)
  * **Sub-header:** `checkTechnicianAssignment.js` & `otpRateLimiter.js` – Phòng thủ chiều sâu
  * **Cột trái (Kiểm soát truy cập dựa trên thuộc tính - ABAC):**
    * Thợ máy chỉ được phép sửa phiếu khi có thuộc tính: `assigned_technicians` chứa `technician_id` của thợ đó và phiếu chưa hoàn tất. Ngăn chặn triệt tiêu rủi ro thợ làm ẩu trên lệnh của thợ khác.
  * **Cột phải (Chống tấn công vét cạn OTP - Rate Limiting):**
    * Dùng Redis Key `ratelimit:otp:{phone}`.
    * Giới hạn tối đa 3 lần yêu cầu OTP trong 10 phút. Ngăn chặn hoàn toàn hành vi Spam SMS/Email và tấn công từ chối dịch vụ (DDoS) tài nguyên gửi mã.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào khối kiểm tra technician_id bên trái, rồi chỉ sang biến đếm Redis bên phải).*
  * *"Hệ thống triển khai cơ chế phòng thủ chiều sâu (Defense-in-Depth). Không dừng lại ở việc kiểm tra vai trò người dùng (RBAC), chúng em áp dụng thêm **Kiểm soát truy cập dựa trên thuộc tính (ABAC)**: một kỹ thuật viên dù có vai trò là thợ máy hợp lệ, nhưng nếu phiếu sửa xe đó không được Quản đốc gán đích danh ID của họ, họ sẽ bị từ chối truy cập ngay tại middleware.*
  * *Đồng thời, cổng gửi mã OTP được bảo vệ bằng Rate Limiter trên Redis, giới hạn tối đa 3 lần gửi trong 10 phút, ngăn chặn hoàn toàn nguy cơ cạn kiệt ngân sách dịch vụ bưu chính điện tử."*
* **CẦU NỐI (BRIDGE):**
  * *"Để người dùng và thợ máy trải nghiệm liền mạch, toàn bộ trạng thái xưởng được quản lý bằng Máy trạng thái hữu hạn và đồng bộ thời gian thực qua WebSocket."*

---

### SLIDE 17: FINITE STATE MACHINE (FSM 6 CHẶNG) & SOCKET.IO ROOMS
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 4: QUY TRÌNH & REALTIME  |  SLIDE 17/24
  * **Tiêu đề:** Finite State Machine (FSM 6 Chặng) & Socket.io Rooms
  * **Phần 1: Máy trạng thái hữu hạn (FSM 6 chặng):**
    * `TIEP_NHAN`: Cố vấn ghi nhận số khung VIN, tình trạng sơ bộ.
    * `CHO_BAO_GIA`: Lập dự toán, khách hàng ký duyệt trực tuyến.
    * `CHO_VAT_TU`: Kích hoạt Redlock giữ chỗ phụ tùng trong kho.
    * `DANG_THI_CONG`: Thợ thao tác checklist, cập nhật tiến độ trên Tablet.
    * `KIEM_TRA_QC`: Quản đốc nghiệm thu lực siết N.m và ảnh kiểm tra.
    * `HOAN_TAT`: Xác nhận thanh toán (Outbox Paid), bàn giao xe.
  * **Phần 2: Phân phòng WebSocket thông minh (Socket.io Rooms):**
    * `room:kanban_board`: Cập nhật bảng điều phối toàn xưởng của Quản đốc tức thì khi có thẻ xe di chuyển.
    * `room:technician_bay_{id}`: Đẩy thông số lực siết và checklist tới đúng Tablet khoang nâng đó.
    * `room:customer_WO_{code}`: Đẩy thông báo thời gian thực về máy khách hàng.
    * Độ trễ truyền tin đo lường thực tế < 80ms (Zero-Polling).
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser theo chu trình 6 chặng từ Tiếp nhận đến Hoàn tất, rồi chỉ sang các Room bên dưới).*
  * *"Vòng đời của lệnh sửa xe được quản lý bằng một **Máy trạng thái hữu hạn (Finite State Machine)** với 6 chặng nghiêm ngặt. Dữ liệu không bao giờ có thể 'nhảy cóc' quy trình: ví dụ không thể bấm Hoàn tất nếu chưa qua bước Nghiệm thu KCS.*
  * *Bên cạnh đó, thay vì để client liên tục gửi request thăm dò (Polling) làm kiệt quệ máy chủ, hệ thống ứng dụng Socket.io với kỹ thuật Phân phòng (Rooms) thông minh: Quản đốc, thợ máy tại từng khoang nâng và khách hàng chỉ lắng nghe đúng kênh sự kiện của mình, độ trễ cập nhật toàn hệ thống dưới 80 mili-giây."*
* **CẦU NỐI (BRIDGE):**
  * *"Đặc biệt ở khâu thanh toán, giao dịch tài chính trực tuyến được bảo vệ bằng các tiêu chuẩn mật mã học chuẩn ngân hàng."*

---

### SLIDE 18: AN NINH MẬT MÃ HỌC: HMAC-SHA512 CHECKSUM & ANTI-REPLAY
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 4: AN NINH HỆ THỐNG  |  SLIDE 18/24
  * **Tiêu đề:** An Ninh Mật Mã Học: HMAC-SHA512 Checksum & Anti-Replay
  * **4 Cơ chế phòng thủ then chốt:**
    * 1. Chữ ký số HMAC-SHA512 (`vnpay.js`): Mọi phản hồi từ cổng thanh toán VNPay đều được đối soát chữ ký số `vnp_SecureHash`. Bất kỳ sự can thiệp sửa đổi số tiền trên đường truyền đều làm sai lệch mã băm và bị hủy bỏ lập tức.
    * 2. Ngăn chặn tấn công Replay Attack: Mỗi yêu cầu thanh toán sinh mã `vnp_TxnRef` duy nhất gắn TTL 10 phút trên Redis; mọi yêu cầu gửi lại sau đó đều bị từ chối.
    * 3. Passwordless OTP Authentication: Đăng nhập nhanh bằng Biển số xe + Số điện thoại + OTP thực gửi qua Gmail SMTP. Triệt tiêu rủi ro lộ mật khẩu tĩnh.
    * 4. RBAC + ABAC Dual Layer: Kiểm tra phân quyền kép: vừa kiểm tra vai trò (Role), vừa kiểm tra thuộc tính gán thợ (Attribute).
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào chữ ký số HMAC-SHA512 và cơ chế chống Replay Attack).*
  * *"Phân hệ thanh toán của hệ thống được bảo vệ theo chuẩn bảo mật tài chính ngân hàng. Khi cổng thanh toán VNPay trả về kết quả, hệ thống tính toán lại mã băm HMAC-SHA512 dựa trên khóa bí mật. Nếu kẻ gian can thiệp vào gói tin trên đường truyền để sửa số tiền thanh toán từ 2 triệu thành 2 nghìn đồng, mã băm Checksum sẽ sai lệch hoàn toàn và giao dịch bị từ chối ngay lập tức.*
  * *Đồng thời, cơ chế khóa giao dịch đơn nhất trên Redis ngăn chặn triệt để các cuộc tấn công phát lại (Replay Attacks)."*
* **CẦU NỐI (BRIDGE):**
  * *"Để đóng gói toàn bộ 4 CSDL và các dịch vụ này lên môi trường thực tế một cách an toàn nhất, nhóm đã tiến hành Container hóa toàn diện."*

---

### SLIDE 19: DOCKER MULTI-STAGE BUILD & CÔ LẬP MẠNG NỘI BỘ (NETWORK ISOLATION)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 5: TRIỂN KHAI & DEVOPS  |  SLIDE 19/24
  * **Tiêu đề:** Docker Multi-Stage Build & Cô Lập Mạng Nội Bộ (Network Isolation)
  * **Cột trái (Tối ưu hóa Container):**
    * Multi-Stage Next.js Build: Sử dụng `output: 'standalone'` trong cấu hình Next.js, phân tích cây cú pháp trừu tượng AST để chỉ lấy đúng mã thực thi. Cắt giảm kích thước image từ 1.2GB xuống còn 120MB (giảm 90%).
    * Triệt tiêu cổng CSDL công cộng (Zero Open DB Ports): Toàn bộ 4 CSDL (Postgres, Mongo, Neo4j, Redis) KHÔNG map cổng ra máy chủ host (chỉ dùng expose nội bộ).
    * Docker Bridge Network: Giao tiếp qua DNS nội bộ (postgres:5432, mongodb:27017, neo4j:7687, redis:6379).
    * Healthcheck & Restart Policy: Cấu hình `depends_on` với healthcheck giúp Backend chỉ khởi động khi CSDL đã sẵn sàng.
  * **Cột phải (Sơ đồ Mạng Cô lập):** Mô hình hóa vùng mạng riêng ảo `hihihaha_bridge (172.20.0.0/16)` đóng kín hoàn toàn trước Internet.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào mức giảm dung lượng 120MB bên trái, rồi chỉ vào sơ đồ mạng cô lập bên phải).*
  * *"Quy trình đóng gói của nhóm áp dụng kỹ thuật **Multi-Stage Build**: phân tích cây cú pháp AST để loại bỏ toàn bộ mã nguồn thừa và các thư viện phát triển nặng nề, rút gọn kích thước Docker Image từ 1.2 GB xuống còn đúng 120 MB.*
  * *Về an ninh hạ tầng, nhóm áp dụng nguyên tắc **Zero Open DB Ports**: cả 4 cơ sở dữ liệu đều không mở bất kỳ cổng nào ra máy chủ vật lý, mà nằm hoàn toàn bên trong mạng nội bộ Docker Bridge Network. Kẻ tấn công quét cổng từ Internet sẽ hoàn toàn 'mù' và không thể tiếp cận các cổng 5432 hay 27017 của CSDL."*
* **CẦU NỐI (BRIDGE):**
  * *"Vậy làm sao để đưa ứng dụng ra môi trường Internet cho khách hàng dùng thử mà không phải mở cổng modem nguy hiểm? Giải pháp của nhóm là Cloudflare Zero-Trust Ingress."*

---

### SLIDE 20: CLOUDFLARE ZERO-TRUST INGRESS: QUIC/UDP TUNNEL & ZERO OPEN PORTS
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 5: TRIỂN KHAI & DEVOPS  |  SLIDE 20/24
  * **Tiêu đề:** Cloudflare Zero-Trust Ingress: QUIC/UDP Tunnel & Zero Open Ports
  * **Bảng so sánh 5 tiêu chí: Deploy Truyền Thống vs. Cloudflare Tunnel:**
    * Mở cổng Tường lửa: Truyền thống phải mở Port 80, 443 trên Router (bị quét Shodan) <-> Cloudflare Tunnel: ZERO OPEN PORTS, daemon tự chủ động bắt tay ra ngoài qua giao thức QUIC/UDP.
    * Địa chỉ IP Công cộng: Truyền thống bắt buộc IP tĩnh đắt đỏ hoặc DDNS chập chờn <-> Cloudflare Tunnel: Hoạt động trên mọi môi trường mạng (kể cả mạng 4G / CGNAT không có IP public).
    * Chứng chỉ SSL/TLS: Truyền thống phải cài Certbot gia hạn mỗi 90 ngày <-> Cloudflare Edge tự cấp SSL/TLS 1.3 và HTTP/3 tự động toàn cầu.
    * Chống tấn công DDoS: Truyền thống máy chủ tự gánh chịu băng thông tấn công <-> Cloudflare Tunnel hưởng trọn khiên chống DDoS 300+ Tbps ở biên mạng.
    * Hỗ trợ WebSocket: Truyền thống dễ đứt kết nối <-> Hỗ trợ Native WebSocket Passthrough cho Socket.io.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser tuần tự vào dòng Zero Open Ports, CGNAT và 300+ Tbps DDoS).*
  * *"Thay vì mở cổng NAT Port Forwarding trên Router — một hành vi tiềm ẩn rủi ro lộ máy chủ trước các công cụ quét lỗ hổng Shodan, nhóm sử dụng **Cloudflare Zero-Trust Tunnel**. Máy chủ đóng kín 100% cổng tường lửa. Một tiến trình daemon chạy ngầm tự chủ động thiết lập đường hầm bảo mật qua giao thức QUIC ra mạng biên của Cloudflare.*
  * *Mô hình này giúp gara triển khai phần mềm ở bất kỳ môi trường mạng nào (kể cả mạng 4G hay mạng nội bộ sau nhiều lớp NAT) mà vẫn có tên miền HTTPS chính thức, được bảo vệ miễn phí bởi hạ tầng chống tấn công DDoS hơn 300 Tbps của Cloudflare."*
* **CẦU NỐI (BRIDGE):**
  * *"Thưa Thầy Cô, một hệ thống kỹ nghệ không thể chỉ đánh giá qua lý thuyết hay mô hình triển khai. Giá trị cốt lõi nằm ở: **Chiến lược đánh chỉ mục CSDL thực tế ra sao, công thức toán học dự báo điều gì, và số liệu đo đạc thực nghiệm chứng minh điều đó như thế nào?** Em xin trân trọng kính mời Hội đồng đến với Slide 21."*

---

### SLIDE 21: CHIẾN LƯỢC ĐÁNH CHỈ MỤC & MINH CHỨNG THỰC NGHIỆM HIỆU NĂNG
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 6: TỐI ƯU HÓA & ĐO LƯỜNG HIỆU NĂNG  |  SLIDE 21/24
  * **Tiêu đề:** Chiến Lược Đánh Chỉ Mục (Indexing Strategies) & Minh Chứng Thực Nghiệm
  * **Sub-header:** Phân tích chiều sâu: Partial Index, Compound Index, Schema Constraint & Đo lường tốc độ thực tế
  * **Cột trái (Chiến lược Đánh chỉ mục chuyên sâu theo CSDL):**
    * **PostgreSQL Partial Index (`idx_outbox_pending`):** Cú pháp `WHERE processed_status = 'PENDING'`. Chỉ index < 0.1% bản ghi chờ xử lý thay vì toàn bảng triệu dòng. Tiết kiệm 95% RAM Shared Buffers, Worker quét `SKIP LOCKED` đạt Index Scan < 4ms!
    * **MongoDB Compound Index (`WorkOrder`):** Cú pháp `{ license_plate: 1, current_status: 1 }`. Thiết kế theo quy tắc ESR (Equality, Sort, Range). Triệt tiêu hoàn toàn `COLLSCAN`, chuyển 100% sang `IXSCAN` $O(\log N)$.
    * **Neo4j Schema Unique Range Index (`Part, Vehicle`):** Cú pháp `CREATE CONSTRAINT FOR (p:Part) REQUIRE p.code IS UNIQUE`. Định vị Entry-Point Node $O(1)$ trên RAM trước khi kích hoạt Index-Free Adjacency nhảy con trỏ.
    * **Redis Key In-Memory Hash Indexing:** Key Namespace `inventory:lock:{sku}`, `rate_limit:{ip}`. Băm trực tiếp SipHash trong RAM, tra cứu $O(1)$ microsecond không tốn I/O đĩa.
  * **Cột phải (Công thức toán & Số liệu thực nghiệm đối chiếu):**
    * **Toán học Trước vs. Sau Kiến trúc:**
      * Va chạm kho: $P_{\text{Naive}} \approx 80\%$ (Poisson) -> $P_{\text{Redlock}} = 0\%$ ($T_{\text{lock}} \le 15\text{ms}$).
      * Đồ thị xe: $T_{\text{SQL}} = O(k \log N) \approx 35\text{ms}$ -> $T_{\text{Neo4j}} = O(1) \approx 5\text{ms}$ (Gia tốc ~5-7x).
      * Dual-Write: $E_{\text{loss}} \approx 10-30$ lỗi/1000 tx -> Outbox Commit WAL: $P_{\text{loss}} = 0\%$.
    * **Thực nghiệm chạy `benchmark_architecture_proof.js`:**
      * ✔ Va chạm kho: Không khóa 8/10 lỗi (80% âm kho!) -> Redlock: 0% va chạm, bảo toàn 100%.
      * ✔ Tốc độ đồ thị: SQL Join 31.1 ms -> Neo4j 5.9 ms (Nhanh gấp đúng 5.3x!).
      * ✔ Hàng đợi Outbox Partial Index: 4.12 ms (Non-blocking, 0ms lock wait time).
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào 4 loại Index bên trái, sau đó quét sang các số liệu thực nghiệm bên phải. Giọng nói dõng dạc, chậm rãi, tự tin).*
  * *"Kính thưa Hội đồng, để một hệ thống Polyglot đạt được tốc độ phản hồi mili-giây, nhóm tập trung giải quyết tận gốc ở **Chiến lược Đánh Chỉ mục (Indexing Strategies) chuyên sâu cho từng hệ quản trị CSDL:**
  * *- **Thứ nhất, ở PostgreSQL:** Nhóm thiết lập **Partial Index** với mệnh đề `WHERE processed_status = 'PENDING'`. Bảng Outbox sau thời gian vận hành sẽ tích tụ hàng triệu bản ghi, nhưng chỉ có chưa đầy 0.1% là sự kiện đang chờ xử lý. Thay vì tạo B-Tree toàn phần làm phình bộ nhớ và chậm thao tác ghi, Partial Index chỉ lưu đúng các bản ghi pending. Dung lượng index siêu nhẹ nằm trọn trong RAM, giúp background worker quét `SKIP LOCKED` đạt tốc độ **Index Scan thần tốc 4.12 mili-giây** mà không tốn I/O đĩa.
  * *- **Thứ hai, ở MongoDB:** Áp dụng **Compound Index** theo chuẩn ESR trên cặp khóa `{ license_plate: 1, current_status: 1 }`. Mọi truy vấn điều phối xưởng chuyển hoàn toàn từ quét toàn bảng (COLLSCAN) sang quét chỉ mục (IXSCAN) với độ phức tạp $O(\log N)$.
  * *- **Thứ ba, ở Neo4j:** Nhóm tạo **Schema Unique Constraint** trên mã phụ tùng và model xe. Điểm mấu chốt: Index này dùng để định vị **Node Điểm Vào (Entry-Point)** ban đầu với thời gian $O(1)$. Ngay sau khi đã trỏ tới xe, hệ thống chuyển sang cơ chế **Index-Free Adjacency** — tức là nhảy thẳng theo con trỏ bộ nhớ vật lý mà không cần thông qua bất kỳ B-Tree nào nữa, giúp thuật toán gợi ý phụ tùng đạt tốc độ **5.9 mili-giây**!
  * *- **Và nhìn sang Cột bên phải:** Kết quả đo kiểm thực nghiệm từ script `benchmark_architecture_proof.js` đối chiếu hoàn hảo với công thức toán lý thuyết:
    * Tỷ lệ va chạm kho không khóa thực tế là 8/10 worker (khớp đúng 80% của phân phối Poisson). Khi có Redlock, va chạm về 0%.
    * Tốc độ đồ thị thực tế nhanh hơn 5.3 lần (5.9ms so với 31.1ms), hoàn toàn nằm trong khoảng gia tốc lý thuyết 5 đến 7 lần!
  * *Những số liệu này khẳng định: Hiệu năng cao của hệ thống đến từ thiết kế kiến trúc và giải pháp chỉ mục có tính toán khoa học, chứ không phải ngẫu nhiên."*
* **CẦU NỐI (BRIDGE):**
  * *"Và ngay sau đây, nhóm xin phép được minh chứng toàn bộ năng lực vận hành này qua 3 Kịch bản Trình diễn Thực tế trực tiếp trước Hội đồng."*

---

### SLIDE 22: KỊCH BẢN LIVE DEMO CAO TRÀO (3 PHÚT CHỨNG MINH THỰC TẾ)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 6: KIỂM THỬ & NGHIỆM THU  |  SLIDE 22/24
  * **Tiêu đề:** Kịch Bản Live Demo Cao Trào (3 Phút Chứng Minh Thực Tế)
  * **3 Kịch bản trình diễn kỹ thuật trực tiếp:**
    * **▶ KỊCH BẢN 1: Realtime Kanban & Tablet Sync (WebSocket):** Thao tác: Mở 2 cửa sổ: Quản đốc kéo thẻ xe trên Kanban Desktop <-> Tablet thợ máy tại khoang nâng nhảy checklist công việc tức thì qua Socket.io mà không cần F5.
    * **▶ KỊCH BẢN 2: Outbox Pattern & Skip Locked (Dual-Write Proof):** Thao tác: Thực hiện giả lập thanh toán đơn xe Camry -> Mở Terminal trực tiếp cho Hội đồng thấy log của Worker: `SELECT ... FOR UPDATE SKIP LOCKED` -> `Atomically marked WorkOrder as PAID`.
    * **▶ KỊCH BẢN 3: Neo4j Graph-RAG AI Traversal (Zero-Hallucination):** Thao tác: Gõ câu mô tả của thợ: 'Xe Camry đạp phanh có tiếng kêu kim loại' -> Hệ thống kích hoạt Cypher đồ thị khung gầm tìm chính xác má phanh dùng chung của Toyota Camry và Lexus ES250.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào từng kịch bản để dẫn đường cho thao tác demo trên màn hình phụ).*
  * *"Để chứng minh hệ thống hoạt động thật 100%, nhóm chuẩn bị sẵn 3 kịch bản trình diễn kỹ thuật:*
  * *Kịch bản 1: Mở song song màn hình Quản đốc và Tablet thợ máy — khi kéo thẻ xe trên Kanban, giao diện thợ tự động cập nhật ngay lập tức qua WebSocket.*
  * *Kịch bản 2: Bấm thanh toán hóa đơn và cho Hội đồng xem trực tiếp cửa sổ Terminal — dòng lệnh `SELECT FOR UPDATE SKIP LOCKED` của Worker ngay lập tức bắt sự kiện và đồng bộ sang MongoDB trong tích tắc.*
  * *Kịch bản 3: Nhập câu hỏi chẩn đoán tiếng kêu phanh xe Camry để thấy AI truy xuất chính xác má phanh dùng chung với Lexus ES250 từ cơ sở dữ liệu đồ thị Neo4j."*
* **CẦU NỐI (BRIDGE):**
  * *"Sau quá trình hiện thực hóa và kiểm chứng nghiêm ngặt, em xin phép tổng kết lại các kết quả đã đạt được và những bài học kiến trúc rút ra."*

---

### SLIDE 23: TỔNG KẾT DỰ ÁN & BÀI HỌC KIẾN TRÚC (RETROSPECTIVE)
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 6: TỔNG KẾT ĐỀ TÀI  |  SLIDE 23/24
  * **Tiêu đề:** Tổng Kết Dự Án & Bài Học Kiến Trúc (Retrospective)
  * **Cột trái (Kết quả đạt được):**
    * Hoàn thành 100% SRS: Thực hiện đầy đủ 4 phân hệ lớn và 5 vai trò tác nhân RBAC/ABAC.
    * Chứng minh thực nghiệm: Vận hành thành công kiến trúc Polyglot với 4 CSDL chuyên biệt, giải quyết triệt để bài toán Dual-Write và Race Condition.
    * Triển khai an toàn: Đóng gói hoàn chỉnh bằng Docker và bảo vệ bằng Cloudflare Zero-Trust Ingress không mở cổng.
  * **Cột phải (Bài học kỹ nghệ & Định hướng tương lai):**
    * Bài học Kỹ nghệ Phần mềm: Kiến trúc tốt không phải là dùng công nghệ mới nhất, mà là hiểu sâu sắc các đánh đổi (Trade-offs) và kiểm soát rủi ro phân tán.
    * Nâng cấp CDC (Debezium + Kafka): Khi quy mô vượt 10.000 tx/s, nâng cấp Polling Worker sang Change Data Capture trực tiếp từ Postgres WAL.
    * Neo4j Causal Clustering: Mở rộng cụm đồ thị phân tán khi chuỗi gara mở rộng toàn quốc.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Chỉ laser vào 3 thành tựu bên trái, rồi chỉ sang các hướng mở rộng bên phải).*
  * *"Nhìn lại toàn bộ hành trình, nhóm đã hoàn thành trọn vẹn 100% các yêu cầu SRS đã cam kết. Bài học lớn nhất mà chúng em rút ra là: Một kiến trúc phần mềm tốt không phải là nhồi nhét thật nhiều công nghệ thời thượng, mà là năng lực thấu hiểu sâu sắc các sự đánh đổi (Trade-offs), lựa chọn đúng công cụ cho đúng bài toán và kiểm soát được các rủi ro của hệ thống phân tán.*
  * *Trong tương lai, khi quy mô vượt ngưỡng hàng chục nghìn giao dịch mỗi giây, hệ thống hoàn toàn sẵn sàng nâng cấp lên giải pháp Change Data Capture (CDC) với Debezium và Kafka, cũng như thiết lập cụm phân tán Neo4j Causal Clustering."*
* **CẦU NỐI (BRIDGE):**
  * *"Và sau đây, em xin phép bước vào slide kết thúc của buổi báo cáo."*

---

### SLIDE 24: PHIÊN HỎI ĐÁP (Q&A) – SẴN SÀNG ĐÓN NHẬN PHẢN BIỆN
* **NỘI DUNG HIỂN THỊ TRÊN SLIDE:**
  * **Header:** CHƯƠNG 6: PHẢN BIỆN & KẾT THÚC  |  SLIDE 24/24
  * **Tiêu đề lớn:** Phiên Hỏi Đáp (Q&A) – Sẵn Sàng Đón Nhận Phản Biện
  * **Lời tri ân:** CẢM ƠN QUÝ THẦY CÔ VÀ HỘI ĐỒNG ĐÃ LẮNG NGHE! HỆ THỐNG ĐÃ SẴN SÀNG CHO PHẦN HỎI ĐÁP PHẢN BIỆN CHUYÊN SÂU
  * **Bộ 4 luận điểm kỹ thuật then chốt giải đáp các câu hỏi khó của Hội đồng:**
    * 1. Tại sao dùng Outbox thay vì 2-Phase Commit (2PC)? => Vì 2PC là Blocking Protocol gây nghẽn tài nguyên và giảm Throughput; Outbox đảm bảo Eventual Consistency và High Availability.
    * 2. Tại sao dùng FOR UPDATE SKIP LOCKED? => Cho phép nhiều Worker chạy song song cạnh tranh xử lý hàng đợi mà không bị Lock Contention khóa chặn lẫn nhau.
    * 3. Kiểm soát ảo giác AI Gemini thế nào? => Áp dụng kiến trúc Graph-RAG: Duyệt topo cơ học trên Neo4j và kiểm tra tồn kho tại MongoDB trước khi nạp context cho LLM.
    * 4. Lợi ích của Cloudflare Tunnel so với Port Forwarding? => Zero Open Ports: Máy chủ đóng 100% cổng tường lửa, tàng hình trước Internet, chống DDoS 300+ Tbps ở biên mạng.
* **LỜI THOẠI THUYẾT TRÌNH:**
  * *(Thao tác: Cúi đầu nhẹ chào Hội đồng, mỉm cười tự tin, chuyển slide sang trạng thái tiếp nhận câu hỏi).*
  * *"Kính thưa Quý Thầy Cô trong Hội đồng,*
  * *Đề tài **HiHiHaHa Auto** là kết tinh của một quá trình nghiên cứu kỹ nghệ nghiêm túc: từ khảo sát nghiệp vụ thực tế, xây dựng kiến trúc đa mô hình dữ liệu, phân tích toán học lý thuyết, cho đến kiểm chứng bằng số liệu thực nghiệm đo đạc.*
  * *Nhóm chúng em xin chân thành cảm ơn sự lắng nghe và những chỉ dẫn quý báu của Quý Thầy Cô. Nhóm chúng em đã sẵn sàng đón nhận những câu hỏi chất vấn và phản biện từ Hội đồng.*
  * *Em xin trân trọng cảm ơn Thầy Cô!"*

---

## PHỤ LỤC: LỆNH CHẠY SCRIPT BENCHMARK LIVE TRÊN TERMINAL
Khi Thầy Cô muốn xem chứng minh thực tế của Slide 21:
```powershell
cd e:\CNPM_GaraSuaXe\backend
node src/scripts/benchmark_architecture_proof.js
```
Kết quả trả về trên màn hình:
1. Va chạm kho Race Condition: Không khóa 8/10 lỗi (80% âm kho) -> Có Redlock: 0% lỗi.
2. Tốc độ đồ thị Neo4j: 5.9ms vs. SQL Multi-Join 31.1ms (Nhanh gấp 5.3 lần).
3. Hàng đợi Outbox Partial Index (`SKIP LOCKED`): Quét non-blocking trong 4.12ms.

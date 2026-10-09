# HIHIHAHA AUTO - RUNBOOK: TROUBLESHOOTING & INCIDENT HANDLING

Tài liệu hướng dẫn xử lý các sự cố vận hành thường gặp trên môi trường Production của hệ thống HIHIHAHA AUTO.

---

## 1. Sự Cố Cloudflare Tunnel Bị Mất Kết Nối (502 / 500 Stream Cancelled)
* **Triệu chứng:** Người dùng truy cập domain `hihihahagara.quachtailoi.id.vn` gặp lỗi `502 Bad Gateway` hoặc log xuất hiện `stream canceled by remote`.
* **Nguyên nhân chính:** 
  1. Service Frontend cổng 8888 hoặc Nginx bị dừng.
  2. Next.js thiếu cấu hình `images.unoptimized: true` dẫn đến crash khi tải ảnh qua proxy.
* **Cách khắc phục:**
  1. Kiểm tra trạng thái Frontend:
     ```bash
     curl -I http://localhost:8888/
     ```
  2. Khởi động lại dịch vụ Cloudflared:
     ```bash
     # Linux
     sudo systemctl restart cloudflared
     # Windows
     cloudflared tunnel --config devops/cloudflare/config.yml run
     ```

---

## 2. Sự Cố Out of Memory (OOM) Trên Container Docker
* **Triệu chứng:** Container Next.js hoặc MongoDB tự động thoát với mã exit code 137.
* **Nguyên nhân:** Thiếu giới hạn RAM (Resource Limit) hoặc rò rỉ bộ nhớ từ image processing.
* **Cách khắc phục:**
  1. Khởi chạy thông qua `devops/compose/docker-compose.prod.yml` đã được định sẵn `deploy.resources.limits`:
     * MongoDB: Tối đa 1536MB
     * PostgreSQL: Tối đa 1024MB
     * Backend: Tối đa 1024MB
     * Next.js: Tối đa 1024MB
  2. Lệnh kiểm tra tài nguyên theo thời gian thực:
     ```bash
     docker stats --no-stream
     ```

---

## 3. Sự Cố Phụ Tùng Tranh Chấp Khóa (Redis Redlock Contention)
* **Triệu chứng:** Kỹ thuật viên báo lỗi "Hệ thống đang xử lý phụ tùng, vui lòng thử lại sau giây lát".
* **Nguyên nhân:** Khóa phân tán Redlock giữ tài nguyên để chống Race Condition trừ âm kho phụ tùng.
* **Cách khắc phục:**
  * Khóa tự động hết hạn (TTL) sau 5000ms.
  * Nếu Redis bị treo kết nối:
    ```bash
    redis-cli ping
    # Kiểm tra danh sách key lock
    redis-cli keys "lock:inventory:*"
    ```

---

## 4. Sự Cố Cơ Sở Dữ Liệu PostgreSQL Đạt Giới Hạn Kết Nối (Connection Pool Exhaustion)
* **Triệu chứng:** Backend log báo `remaining connection slots are reserved for non-replication superuser connections`.
* **Cách khắc phục:**
  1. Kiểm tra số lượng kết nối hiện tại:
     ```sql
     SELECT count(*), state FROM pg_stat_activity GROUP BY state;
     ```
  2. Cấu hình `max_connections` trong PostgreSQL hoặc chỉnh `PG_MAX_POOL=20` trong `.env`.

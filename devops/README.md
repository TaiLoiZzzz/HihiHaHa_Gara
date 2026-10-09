# 🚀 HIHIHAHA AUTO - DEVOPS & INFRASTRUCTURE MANUAL

> **Bộ tài liệu & cấu hình DevOps tiêu chuẩn cho Hệ thống Quản trị Gara Ô tô Thông minh HIHIHAHA AUTO**  
> Kiến trúc: **Polyglot Persistence (PostgreSQL + MongoDB + Redis + Neo4j)** + **Next.js 14 Standalone** + **Node.js Express API & WebSockets** + **Cloudflare Zero Trust Tunnel**.

---

## 📁 1. Cấu Trúc Thư Mục DevOps (`/devops`)

```text
devops/
├── README.md                          # Sổ tay kiến trúc & vận hành DevOps toàn diện
├── compose/
│   ├── docker-compose.prod.yml        # Orchestration Production có Healthchecks & Resource Limits
│   ├── docker-compose.dev.yml         # Môi trường Local Dev (Expose ports cho Compass, DBeaver, Neo4j)
│   └── docker-compose.monitoring.yml  # Bộ giám sát Observability: Prometheus, Grafana, cAdvisor, Node Exporter
├── nginx/
│   ├── nginx.conf                     # Cấu hình lõi Nginx: Gzip, Buffer, Rate Limiting zones
│   └── conf.d/
│       └── hihihaha.conf              # Virtual Host: Upstream proxy, Socket.IO WebSockets, Static Cache
├── cloudflare/
│   ├── config.yml                     # Cấu hình Ingress Cloudflare Tunnel (Zero Trust, Domain thực)
│   └── cloudflared.service            # Systemd Service unit chạy daemon 24/7 trên máy chủ Linux
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml             # Cấu hình Scraping metrics từ Node.js API, DBs, containers
│   │   └── alert_rules.yml            # Bộ quy tắc cảnh báo (Sập backend, High Memory, Đầy ổ cứng)
│   └── grafana/
│       └── provisioning/
│           └── datasources/
│               └── datasource.yml     # Tự động nạp Prometheus Datasource vào Grafana
├── scripts/
│   ├── healthcheck.sh / .ps1          # Audit tự động kiểm tra 6 thành phần hạ tầng (Linux & Windows)
│   ├── backup.sh / .ps1               # Sao lưu tự động PostgreSQL + MongoDB với nén và retention 7 ngày
│   ├── restore.sh / .ps1              # Khôi phục dữ liệu thảm họa (Disaster Recovery)
│   └── deploy.sh / .ps1               # Kịch bản triển khai & kiểm thử Zero-downtime
├── env/
│   ├── .env.example                   # Mẫu cấu hình môi trường chuẩn có hướng dẫn chi tiết
│   └── .env.production.example        # Mẫu thông số bảo mật cho môi trường Production
└── docs/
    ├── RUNBOOK_DISASTER_RECOVERY.md   # Quy trình khôi phục dữ liệu khi gặp sự cố thảm họa (RPO/RTO)
    └── RUNBOOK_TROUBLESHOOTING.md     # Cẩm nang chẩn đoán & xử lý sự cố (Tunnel, OOM, Redlock, Postgres)
```

---

## 🛠️ 2. Hướng Dẫn Vận Hành Nhanh (Quick Start)

### A. Kiểm tra sức khỏe toàn bộ hạ tầng (Healthcheck Audit)
Chạy script kiểm tra tự động xem tất cả 4 cơ sở dữ liệu và 2 web server có đang hoạt động:
* **Trên Windows (PowerShell):**
  ```powershell
  powershell -File devops/scripts/healthcheck.ps1
  ```
* **Trên Linux (Bash):**
  ```bash
  chmod +x devops/scripts/*.sh
  ./devops/scripts/healthcheck.sh
  ```

### B. Khởi chạy toàn bộ hệ thống bằng Docker Production
Toàn bộ CSDL chạy nội bộ trong mạng ảo cô lập (`hihihaha_internal_net`), không mở port bừa bãi ra ngoài Internet:
```bash
docker compose -f devops/compose/docker-compose.prod.yml up -d --build
```

### C. Khởi chạy môi trường Dev để kết nối GUI Tools (Compass, DBeaver)
```bash
docker compose -f devops/compose/docker-compose.dev.yml up -d
```
* **PostgreSQL:** `localhost:5432` (User: `postgres`, Pass: `postgres`, DB: `hihihaha_db`)
* **MongoDB:** `mongodb://localhost:27017/hihihaha_db` (Xem bằng MongoDB Compass)
* **Neo4j Browser:** `http://localhost:7474` (Bolt: `localhost:7687`, User: `neo4j`, Pass: `neo4j123456`)
* **Redis:** `localhost:6379` (Xem bằng RedisInsight)

### D. Khởi chạy Bộ Giám Sát Tài Nguyên (Prometheus & Grafana)
```bash
docker compose -f devops/compose/docker-compose.monitoring.yml up -d
```
* **Grafana Dashboard:** `http://localhost:3001` (User: `admin`, Pass: `HiHiHaHa@2026!`)
* **Prometheus Targets:** `http://localhost:9090`

---

## 🔒 3. Bảo Mật & Cloudflare Zero Trust Tunnel

Hệ thống triển khai mô hình **Zero Inbound Ports**:
* Không mở cổng 80/443 trên Router gia đình/văn phòng.
* Lưu lượng đi qua kênh mã hóa an toàn của Cloudflare Tunnel về trực tiếp container Frontend:
  * Domain: `https://hihihahagara.quachtailoi.id.vn`
  * Đã bật Anti-DDoS L3-L7 của Cloudflare và WAF Bot Detection.
  * Cấu hình ingress chi tiết nằm tại `devops/cloudflare/config.yml`.

---

## 💾 4. Sao Lưu & Phục Hồi Dữ Liệu (Backup & Restore)

### Sao lưu tức thì:
* **Linux:** `./devops/scripts/backup.sh`
* **Windows:** `powershell -File devops/scripts/backup.ps1`
Dữ liệu được nén thành `.sql.gz` và `.archive.gz` lưu trữ tại `devops/backups/YYYYMMDD_HHMMSS/`. Hệ thống tự động xóa backup quá 7 ngày để tiết kiệm dung lượng.

### Phục hồi thảm họa:
* **Linux:** `./devops/scripts/restore.sh devops/backups/20261009_151200`
* **Windows:** `powershell -File devops/scripts/restore.ps1 -BackupDir devops\backups\20261009_151200`

---

## 🔄 5. CI/CD Tự Động Hóa (GitHub Actions)
* `.github/workflows/ci.yml`: Tự động kiểm tra cú pháp, cài đặt dependencies và build kiểm thử Next.js / Node.js mỗi khi đẩy code lên `main` hoặc tạo Pull Request.
* `.github/workflows/cd.yml`: Tự động đóng gói Docker Images chuẩn bị triển khai khi release phiên bản mới (`v*.*.*`).

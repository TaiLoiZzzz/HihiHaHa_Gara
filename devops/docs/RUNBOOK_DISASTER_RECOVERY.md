# HIHIHAHA AUTO - RUNBOOK: DISASTER RECOVERY & FAILOVER

## 1. Mục Tiêu Khôi Phục (Recovery Objectives)
* **RPO (Recovery Point Objective):** <= 24 giờ (đối với backup định kỳ ban đêm) hoặc <= 1 giờ (đối với Write-Ahead Log/Binlog).
* **RTO (Recovery Time Objective):** <= 30 phút để khôi phục toàn bộ 4 cơ sở dữ liệu và kích hoạt lại Web Server.

---

## 2. Quy Trình Khôi Phục Dữ Liệu Từng Database

### A. Khôi phục PostgreSQL (Auth, RBAC, Nhân Viên, Khách Hàng)
1. Kiểm tra file backup mới nhất trong thư mục `devops/backups/`:
   ```bash
   ls -la devops/backups/
   ```
2. Thực hiện restore:
   ```bash
   gunzip -c devops/backups/<TIMESTAMP>/postgres_<TIMESTAMP>.sql.gz | psql -h localhost -U postgres -d hihihaha_db
   ```
3. Kiểm tra tính toàn vẹn:
   ```bash
   psql -h localhost -U postgres -d hihihaha_db -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM customers;"
   ```

### B. Khôi phục MongoDB (Lệnh Sửa Chữa, Báo Giá, Ảnh Nghiệm Thu)
1. Thực hiện restore với cờ `--drop` để làm sạch collection hỏng:
   ```bash
   mongorestore --drop --archive="devops/backups/<TIMESTAMP>/mongo_<TIMESTAMP>.archive.gz" --gzip
   ```
2. Kiểm tra tính toàn vẹn:
   ```bash
   mongosh hihihaha_db --eval "db.work_orders.countDocuments(); db.inventory_items.countDocuments();"
   ```

### C. Khôi phục Redis (Cache & Session)
* Redis đóng vai trò Cache & Distributed Lock (Redlock).
* Nếu Redis gặp sự cố, khởi động lại service:
  ```bash
  docker restart hihihaha_redis_prod
  # hoặc
  redis-server --daemonize yes
  ```
* Hệ thống có cơ chế Cache-Aside tự bù đắp (fallback) từ MongoDB và Postgres nếu Redis trống dữ liệu.

### D. Khôi phục Neo4j (Graph Tri Thức Bắt Bệnh Xe)
* Chạy lại script nạp ontology đồ thị xe nếu cơ sở dữ liệu đồ thị trống:
  ```bash
  node backend/src/config/scripts/seed_neo4j.js
  ```

---

## 3. Lệnh Khôi Phục 1 Bước Tự Động
Hệ thống đã trang bị sẵn script tự động:
```bash
# Trên Linux:
./devops/scripts/restore.sh ./devops/backups/20261009_150000

# Trên Windows PowerShell:
.\devops\scripts\restore.ps1 -BackupDir .\devops\backups\20261009_150000
```

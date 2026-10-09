#!/usr/bin/env bash
# ==============================================================================
# HIHIHAHA AUTO - MULTI-DATABASE BACKUP & ARCHIVAL SCRIPT
# Backs up PostgreSQL & MongoDB with timestamped compression and 7-day retention
# ==============================================================================

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_ROOT="${BACKUP_DIR:-./devops/backups}"
CURRENT_BACKUP="${BACKUP_ROOT}/${TIMESTAMP}"

mkdir -p "${CURRENT_BACKUP}"

echo "[INFO] Starting Polyglot Database Backup at ${TIMESTAMP}..."

# 1. Backup PostgreSQL
echo "[INFO] Dumping PostgreSQL (hihihaha_db)..."
if docker ps --format '{{.Names}}' | grep -q "hihihaha_postgres"; then
    docker exec hihihaha_postgres pg_dump -U postgres -d hihihaha_db | gzip > "${CURRENT_BACKUP}/postgres_${TIMESTAMP}.sql.gz"
elif command -v pg_dump > /dev/null 2>&1; then
    pg_dump -h localhost -p 5432 -U postgres -d hihihaha_db | gzip > "${CURRENT_BACKUP}/postgres_${TIMESTAMP}.sql.gz"
else
    echo "[WARN] pg_dump not available, skipping Postgres dump."
fi

# 2. Backup MongoDB
echo "[INFO] Dumping MongoDB (hihihaha_db)..."
if docker ps --format '{{.Names}}' | grep -q "hihihaha_mongo"; then
    docker exec hihihaha_mongo mongodump --db hihihaha_db --archive | gzip > "${CURRENT_BACKUP}/mongo_${TIMESTAMP}.archive.gz"
elif command -v mongodump > /dev/null 2>&1; then
    mongodump --db hihihaha_db --archive | gzip > "${CURRENT_BACKUP}/mongo_${TIMESTAMP}.archive.gz"
else
    echo "[WARN] mongodump not available, skipping Mongo dump."
fi

# 3. Retention policy: Remove backups older than 7 days
echo "[INFO] Purging backups older than 7 days..."
find "${BACKUP_ROOT}" -mindepth 1 -maxdepth 1 -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true

echo "[SUCCESS] Backup complete! Saved to: ${CURRENT_BACKUP}"

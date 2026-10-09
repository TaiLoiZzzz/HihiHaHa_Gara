#!/usr/bin/env bash
# ==============================================================================
# HIHIHAHA AUTO - DISASTER RECOVERY RESTORE SCRIPT
# Usage: ./devops/scripts/restore.sh /path/to/backup/YYYYMMDD_HHMMSS
# ==============================================================================

set -e

BACKUP_DIR="$1"

if [ -z "$BACKUP_DIR" ] || [ ! -d "$BACKUP_DIR" ]; then
    echo "Usage: $0 <path_to_backup_folder>"
    exit 1
fi

echo "[ALERT] Restoring databases from: $BACKUP_DIR"
read -p "Are you sure you want to overwrite databases? (y/N): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Restore cancelled."
    exit 0
fi

# 1. Restore PostgreSQL
PG_FILE=$(find "$BACKUP_DIR" -name "postgres_*.sql.gz" | head -n 1)
if [ -n "$PG_FILE" ]; then
    echo "[INFO] Restoring PostgreSQL from $PG_FILE..."
    gunzip -c "$PG_FILE" | psql -h localhost -p 5432 -U postgres -d hihihaha_db
    echo "[OK] PostgreSQL restored."
fi

# 2. Restore MongoDB
MONGO_FILE=$(find "$BACKUP_DIR" -name "mongo_*.archive.gz" | head -n 1)
if [ -n "$MONGO_FILE" ]; then
    echo "[INFO] Restoring MongoDB from $MONGO_FILE..."
    gunzip -c "$MONGO_FILE" | mongorestore --drop --archive
    echo "[OK] MongoDB restored."
fi

echo "[SUCCESS] Database restoration complete!"

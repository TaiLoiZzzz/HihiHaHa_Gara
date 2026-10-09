# ==============================================================================
# HIHIHAHA AUTO - MULTI-DATABASE BACKUP (POWERSHELL)
# ==============================================================================

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupRoot = Join-Path $PSScriptRoot "..\backups"
$CurrentBackup = Join-Path $BackupRoot $Timestamp

if (!(Test-Path $CurrentBackup)) {
    New-Item -ItemType Directory -Path $CurrentBackup -Force | Out-Null
}

Write-Host "[INFO] Starting Polyglot Database Backup at $Timestamp..." -ForegroundColor Cyan

# 1. PostgreSQL Backup
Write-Host "[INFO] Backing up PostgreSQL..." -ForegroundColor Yellow
$pgDump = Get-Command "pg_dump" -ErrorAction SilentlyContinue
if ($pgDump) {
    $pgOutFile = Join-Path $CurrentBackup "postgres_$Timestamp.sql"
    & pg_dump -h localhost -p 5432 -U postgres -d hihihaha_db -f $pgOutFile
    Write-Host "[OK] PostgreSQL backup saved to $pgOutFile" -ForegroundColor Green
} else {
    Write-Host "[WARN] pg_dump not found in PATH, skipping local Postgres dump." -ForegroundColor Yellow
}

# 2. MongoDB Backup
Write-Host "[INFO] Backing up MongoDB..." -ForegroundColor Yellow
$mongoDump = Get-Command "mongodump" -ErrorAction SilentlyContinue
if ($mongoDump) {
    $mongoOutArchive = Join-Path $CurrentBackup "mongo_$Timestamp.archive"
    & mongodump --db hihihaha_db --archive="$mongoOutArchive"
    Write-Host "[OK] MongoDB backup saved to $mongoOutArchive" -ForegroundColor Green
} else {
    Write-Host "[WARN] mongodump not found in PATH, skipping local Mongo dump." -ForegroundColor Yellow
}

# 3. Retention: Clean backups older than 7 days
Get-ChildItem -Path $BackupRoot -Directory -ErrorAction SilentlyContinue | Where-Object {
    $_.CreationTime -lt (Get-Date).AddDays(-7)
} | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[SUCCESS] Backup process finished! Target folder: $CurrentBackup" -ForegroundColor Green

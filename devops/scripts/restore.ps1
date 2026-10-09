param (
    [Parameter(Mandatory=$true)]
    [string]$BackupDir
)

# ==============================================================================
# HIHIHAHA AUTO - DISASTER RECOVERY RESTORE (POWERSHELL)
# Usage: .\devops\scripts\restore.ps1 -BackupDir .\devops\backups\20261009_151200
# ==============================================================================

if (!(Test-Path $BackupDir)) {
    Write-Host "[ERROR] Backup directory not found: $BackupDir" -ForegroundColor Red
    exit 1
}

Write-Host "[ALERT] Restoring databases from: $BackupDir" -ForegroundColor Yellow
$confirm = Read-Host "Are you sure you want to restore and overwrite data? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
    exit 0
}

# 1. Restore PostgreSQL
$pgFile = Get-ChildItem -Path $BackupDir -Filter "postgres_*.sql" | Select-Object -First 1
if ($pgFile) {
    Write-Host "[INFO] Restoring PostgreSQL from $($pgFile.FullName)..." -ForegroundColor Cyan
    & psql -h localhost -p 5432 -U postgres -d hihihaha_db -f $pgFile.FullName
    Write-Host "[OK] PostgreSQL restored." -ForegroundColor Green
}

# 2. Restore MongoDB
$mongoFile = Get-ChildItem -Path $BackupDir -Filter "mongo_*.archive" | Select-Object -First 1
if ($mongoFile) {
    Write-Host "[INFO] Restoring MongoDB from $($mongoFile.FullName)..." -ForegroundColor Cyan
    & mongorestore --drop --archive=$($mongoFile.FullName)
    Write-Host "[OK] MongoDB restored." -ForegroundColor Green
}

Write-Host "[SUCCESS] Restoration completed." -ForegroundColor Green

# ==============================================================================
# HIHIHAHA AUTO - PRODUCTION DEPLOY SCRIPT (POWERSHELL)
# ==============================================================================

$ErrorActionPreference = "Stop"

Write-Host "=== [1/4] Pulling Latest Changes from Git ===" -ForegroundColor Cyan
git pull origin main

Write-Host "=== [2/4] Verifying Backend Dependencies ===" -ForegroundColor Cyan
Push-Location backend
npm ci --omit=dev
Pop-Location

Write-Host "=== [3/4] Building Next.js Standalone Client ===" -ForegroundColor Cyan
Push-Location client
npm ci
npx next build
Pop-Location

Write-Host "=== [4/4] Executing Healthcheck Audit ===" -ForegroundColor Cyan
& powershell -File devops/scripts/healthcheck.ps1

Write-Host "=== [SUCCESS] Local Deployment & Build Verification Complete! ===" -ForegroundColor Green

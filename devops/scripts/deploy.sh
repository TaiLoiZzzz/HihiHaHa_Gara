#!/usr/bin/env bash
# ==============================================================================
# HIHIHAHA AUTO - PRODUCTION ZERO-DOWNTIME DEPLOY SCRIPT (BASH)
# ==============================================================================

set -e

echo "=== [1/4] Pulling Latest Changes from Git ==="
git pull origin main

echo "=== [2/4] Verifying Backend Dependencies ==="
cd backend
npm ci --omit=dev
cd ..

echo "=== [3/4] Building Next.js Standalone Client ==="
cd client
npm ci
npx next build
cd ..

echo "=== [4/4] Restarting Services & Running Healthcheck ==="
if command -v systemctl > /dev/null 2>&1; then
    sudo systemctl restart hihihaha-backend
    sudo systemctl restart hihihaha-frontend
fi

sleep 3
./devops/scripts/healthcheck.sh

echo "=== [SUCCESS] Deployment Completed Successfully! ==="

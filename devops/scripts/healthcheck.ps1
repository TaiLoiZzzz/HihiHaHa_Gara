# ==============================================================================
# HIHIHAHA AUTO - MULTI-TIER INFRASTRUCTURE HEALTHCHECK (POWERSHELL)
# ==============================================================================

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "       HIHIHAHA AUTO - SYSTEM HEALTH & CONNECTIVITY AUDIT (WINDOWS)           " -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan

# 1. Express Backend
Write-Host -NoNewline "Checking Express Backend (Port 5000)... "
try {
    $res = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
        Write-Host "[OK] Backend is healthy (HTTP 200)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Backend returned HTTP $($res.StatusCode)" -ForegroundColor Red
    }
} catch {
    # Fallback to /api/v1/health or port check
    try {
        $tcp = Test-NetConnection -ComputerName 127.0.0.1 -Port 5000 -WarningAction SilentlyContinue
        if ($tcp.TcpTestSucceeded) {
            Write-Host "[OK] Backend port 5000 is listening" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] Backend unreachable on port 5000" -ForegroundColor Red
        }
    } catch {
        Write-Host "[FAIL] $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 2. Next.js Frontend
Write-Host -NoNewline "Checking Next.js Frontend (Port 8888)... "
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8888/" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($res.StatusCode -eq 200) {
        Write-Host "[OK] Frontend is serving (HTTP 200)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Frontend returned HTTP $($res.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[FAIL] Frontend unreachable on port 8888: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. PostgreSQL
Write-Host -NoNewline "Checking PostgreSQL (Port 5432)... "
$pg = Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -WarningAction SilentlyContinue
if ($pg.TcpTestSucceeded) {
    Write-Host "[OK] PostgreSQL port 5432 is open & accepting connections" -ForegroundColor Green
} else {
    Write-Host "[FAIL] PostgreSQL port 5432 is closed" -ForegroundColor Red
}

# 4. MongoDB
Write-Host -NoNewline "Checking MongoDB (Port 27017)... "
$mongo = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue
if ($mongo.TcpTestSucceeded) {
    Write-Host "[OK] MongoDB port 27017 is open & accepting connections" -ForegroundColor Green
} else {
    Write-Host "[FAIL] MongoDB port 27017 is closed" -ForegroundColor Red
}

# 5. Redis
Write-Host -NoNewline "Checking Redis (Port 6379)... "
$redis = Test-NetConnection -ComputerName 127.0.0.1 -Port 6379 -WarningAction SilentlyContinue
if ($redis.TcpTestSucceeded) {
    Write-Host "[OK] Redis port 6379 is open & accepting connections" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Redis port 6379 is closed" -ForegroundColor Red
}

# 6. Neo4j
Write-Host -NoNewline "Checking Neo4j (Port 7687 / 7474)... "
$neo4j = Test-NetConnection -ComputerName 127.0.0.1 -Port 7687 -WarningAction SilentlyContinue
if ($neo4j.TcpTestSucceeded) {
    Write-Host "[OK] Neo4j Bolt port 7687 is open & accepting connections" -ForegroundColor Green
} else {
    Write-Host "[WARN] Neo4j Bolt port 7687 is closed" -ForegroundColor Yellow
}

Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "Infrastructure check completed." -ForegroundColor Green

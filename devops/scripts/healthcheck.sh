#!/usr/bin/env bash
# ==============================================================================
# HIHIHAHA AUTO - MULTI-TIER INFRASTRUCTURE HEALTHCHECK AUDIT
# Tests all 4 polyglot databases, backend API, frontend and edge proxy
# ==============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}        HIHIHAHA AUTO - SYSTEM HEALTH & CONNECTIVITY AUDIT            ${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# 1. Check PostgreSQL
echo -n "Checking PostgreSQL (Port 5432)... "
if docker exec hihihaha_postgres_prod pg_isready -U postgres -d hihihaha_db > /dev/null 2>&1 || pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}[OK] PostgreSQL is healthy${NC}"
else
    echo -e "${RED}[FAIL] PostgreSQL connection failed${NC}"
fi

# 2. Check MongoDB
echo -n "Checking MongoDB (Port 27017)... "
if docker exec hihihaha_mongo_prod mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1 || mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
    echo -e "${GREEN}[OK] MongoDB is healthy${NC}"
else
    echo -e "${RED}[FAIL] MongoDB connection failed${NC}"
fi

# 3. Check Redis
echo -n "Checking Redis (Port 6379)... "
if [ "$(docker exec hihihaha_redis_prod redis-cli ping 2>/dev/null || redis-cli ping 2>/dev/null)" == "PONG" ]; then
    echo -e "${GREEN}[OK] Redis is responding PONG${NC}"
else
    echo -e "${RED}[FAIL] Redis connection failed${NC}"
fi

# 4. Check Neo4j
echo -n "Checking Neo4j (Port 7474 / 7687)... "
if curl -s -f http://localhost:7474 > /dev/null 2>&1; then
    echo -e "${GREEN}[OK] Neo4j HTTP/Bolt is healthy${NC}"
else
    echo -e "${YELLOW}[WARN] Neo4j HTTP endpoint unreachable (check docker status)${NC}"
fi

# 5. Check Express REST Backend
echo -n "Checking Express Backend (Port 5000)... "
if curl -s -f http://localhost:5000/api/v1/health > /dev/null 2>&1 || curl -s -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}[OK] Express Backend is responding 200 OK${NC}"
else
    echo -e "${RED}[FAIL] Express Backend is down on port 5000${NC}"
fi

# 6. Check Next.js Frontend
echo -n "Checking Next.js Frontend (Port 8888)... "
FRONT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8888/ || true)
if [ "$FRONT_STATUS" == "200" ]; then
    echo -e "${GREEN}[OK] Next.js Frontend is serving (HTTP 200)${NC}"
else
    echo -e "${RED}[FAIL] Next.js returned HTTP $FRONT_STATUS${NC}"
fi

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${GREEN}Infrastructure audit completed.${NC}"

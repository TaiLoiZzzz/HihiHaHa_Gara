const Redis = require('ioredis');
require('dotenv').config();

const host = process.env.REDIS_HOST || 'localhost';
const port = parseInt(process.env.REDIS_PORT || '6379', 10);

// khoi tao redis client voi ioredis
const redis = new Redis({
  host,
  port,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  console.log(`✅ [Redis] Connected successfully to ${host}:${port}`);
});

redis.on('error', (err) => {
  console.error('❌ [Redis] Connection error:', err.message);
});

// quy tac dat ten key va ttl chuan
const REDIS_KEYS = {
  emailCooldown: (email) => `ratelimit:email_cooldown:${email}`, // TTL 60s
  dailyEmailLimit: (email) => `ratelimit:daily_email:${email}`, // TTL 86400s
  lockPart: (partCode) => `lock:part:${partCode}`, // TTL 5s redlock
  reservedPart: (partCode) => `reserved:part:${partCode}`, // TTL 900s 15 phut giu kho
  holdOrderPart: (orderCode, partCode) => `hold:${orderCode}:${partCode}`, // TTL 900s
};

// ham test ghi va doc key co ttl
const testRedisOperations = async () => {
  try {
    const testKey = 'test_key';
    const testValue = 'val_hihihaha_2026';
    await redis.set(testKey, testValue, 'EX', 10);
    const retrievedVal = await redis.get(testKey);
    console.log(`🧪 [Redis Test] SET/GET successful: key="${testKey}", val="${retrievedVal}", TTL=10s`);
    return retrievedVal === testValue;
  } catch (err) {
    console.error('❌ [Redis Test] Error testing key ops:', err.message);
    return false;
  }
};

// ham test ping redis khi startup
const checkRedisConnection = async () => {
  try {
    const pong = await redis.ping();
    if (pong === 'PONG') {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

module.exports = {
  redis,
  REDIS_KEYS,
  testRedisOperations,
  checkRedisConnection,
};

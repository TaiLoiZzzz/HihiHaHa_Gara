const Redlock = require('redlock').default || require('redlock');
const { redis } = require('./redis');

// khoi tao instance redlock ket noi den redis client
const redlock = new Redlock([redis], {
  driftFactor: 0.01,
  retryCount: 3,
  retryDelay: 200,
  retryJitter: 50,
  automaticExtensionThreshold: 500,
});

redlock.on('error', (err) => {
  console.error('❌ [Redis Redlock] Mutex Lock error:', err.message);
});

module.exports = {
  redlock,
};

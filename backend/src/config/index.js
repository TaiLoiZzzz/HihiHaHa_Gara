const { connectMongo } = require('./mongo');
const { pool: postgresPool, query: pgQuery, checkPostgresConnection } = require('./postgres');
const { driver: neo4jDriver, runCypher, checkNeo4jConnection } = require('./neo4j');
const { redis, REDIS_KEYS, checkRedisConnection, testRedisOperations } = require('./redis');

// ham khoi tao va kiem tra ket noi den ca 4 csdl polyglot
const checkAllDatabaseConnections = async () => {
  console.log('\n🔍 [Polyglot Infrastructure] Testing connections to all 4 DBMS...');

  const results = await Promise.allSettled([
    connectMongo(),
    checkPostgresConnection(),
    checkNeo4jConnection(),
    checkRedisConnection(),
  ]);

  const allSuccess = results.every((r) => r.status === 'fulfilled' && r.value !== false);

  if (allSuccess) {
    console.log('✨ [Polyglot Infrastructure] ALL 4 DATABASES (Mongo, Postgres, Neo4j, Redis) ARE ONLINE AND HEALTHY!\n');
  } else {
    console.warn('⚠️ [Polyglot Infrastructure] Some database connections reported issues. Check logs above.\n');
  }

  return allSuccess;
};

module.exports = {
  // Mongo
  connectMongo,

  // PostgreSQL
  postgresPool,
  pgQuery,
  checkPostgresConnection,

  // Neo4j
  neo4jDriver,
  runCypher,
  checkNeo4jConnection,

  // Redis
  redis,
  REDIS_KEYS,
  checkRedisConnection,
  testRedisOperations,

  // Unified Healthcheck
  checkAllDatabaseConnections,
};

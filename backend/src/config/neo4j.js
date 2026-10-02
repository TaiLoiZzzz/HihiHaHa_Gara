const neo4j = require('neo4j-driver');
require('dotenv').config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:17687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'neo4j123456';

// khoi tao driver neo4j
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// ham thuc thi cypher query
const runCypher = async (queryText, params = {}) => {
  const session = driver.session();
  try {
    const result = await session.run(queryText, params);
    return result;
  } finally {
    await session.close();
  }
};

// ham test ket noi neo4j
const checkNeo4jConnection = async () => {
  const session = driver.session();
  try {
    const res = await session.run('RETURN "Neo4j Graph Database Connected!" AS status');
    const statusText = res.records[0].get('status');
    console.log(`✅ [Neo4j] ${statusText} (URI: ${uri})`);
    return true;
  } catch (err) {
    console.error('❌ [Neo4j] Connection error:', err.message);
    return false;
  } finally {
    await session.close();
  }
};

module.exports = {
  driver,
  runCypher,
  checkNeo4jConnection,
};

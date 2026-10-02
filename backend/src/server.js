const app = require('./app');
const logger = require('./utils/logger');
const { checkAllDatabaseConnections } = require('./config');

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    logger.info(`🚀 [HIHIHAHA_AUTO] Backend Server listening on http://localhost:${PORT}`);
    // kiem tra ket noi den ca 4 CSDL polyglot khi khoi dong
    await checkAllDatabaseConnections();
  });
}

module.exports = app;

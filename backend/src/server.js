const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const { checkAllDatabaseConnections } = require('./config');
const { initSocketServer } = require('./sockets');
const { startOutboxWorker } = require('./workers/outbox.worker');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// step 135: gắn Socket.io Server vào HTTP Server
initSocketServer(server);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, async () => {
    logger.info(`🚀 [HIHIHAHA_AUTO] Backend API & Realtime Socket Server listening on http://localhost:${PORT}`);
    // kiem tra ket noi den ca 4 CSDL polyglot khi khoi dong
    await checkAllDatabaseConnections();

    // step 129: khoi dong Outbox Background Polling Worker (2000ms)
    startOutboxWorker(2000);
  });
}

module.exports = { app, server };

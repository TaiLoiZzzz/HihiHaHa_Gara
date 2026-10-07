const { Server } = require('socket.io');

let io = null;

// step 135: khoi tao Socket.io Server (CORS cho phep client frontend)
const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('⚡ [Socket.io] Realtime Socket Server initialized successfully');

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

    // step 136 & 137: su kien join_order (room:order:${order_code})
    socket.on('join_order', (data) => {
      const orderCode = typeof data === 'string' ? data : data?.order_code;
      if (orderCode) {
        const roomName = `room:order:${orderCode}`;
        socket.join(roomName);
        console.log(`📥 [Socket.io] Socket ${socket.id} joined room: ${roomName}`);
        socket.emit('joined_room_success', { room: roomName, order_code: orderCode });
      }
    });

    // step 136: room:workshop va room:kanban cho tho va quan doc
    socket.on('join_workshop', () => {
      socket.join('room:workshop');
      console.log(`🛠️ [Socket.io] Socket ${socket.id} joined room: room:workshop`);
    });

    socket.on('join_kanban', () => {
      socket.join('room:kanban');
      console.log(`📊 [Socket.io] Socket ${socket.id} joined room: room:kanban`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    console.warn('⚠️ [Socket.io] getIO called before server initialization!');
  }
  return io;
};

// step 140: ban su kien realtime PROGRESS_UPDATED toi cac rooms
const broadcastProgressUpdated = (orderCode, progressData) => {
  if (!io) return;

  const roomName = `room:order:${orderCode}`;
  const payload = {
    order_code: orderCode,
    timestamp: new Date().toISOString(),
    ...progressData,
  };

  // ban event toi room:order:${order_code} (khach hang), room:workshop (tho) va room:kanban (quan doc)
  io.to(roomName).to('room:workshop').to('room:kanban').emit('PROGRESS_UPDATED', payload);

  console.log(`📡 [Socket.io Realtime Broadcast] Emitted PROGRESS_UPDATED for order [${orderCode}] to ${roomName} & room:kanban`);
};

module.exports = {
  initSocketServer,
  getIO,
  broadcastProgressUpdated,
};

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

import { SessionUser } from './types/User';
import { Message } from './types/Message';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const onlineUsers = new Set<string>();
const lastSeenMap: Record<string, string> = {};

app.post('/emit-message', (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    receiverId,
    message,
  }: {
    receiverId: string;
    message: Message;
  } = req.body;

  io.to(receiverId).emit('new-message', message);

  return res.json({ success: true });
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('user', (user: SessionUser) => {
    const userId = user.id;

    socket.data.userId = userId;

    socket.join(userId);

    onlineUsers.add(userId);

    io.emit('presence-update', {
      onlineUsers: Array.from(onlineUsers),
      lastSeen: lastSeenMap,
    });
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId;

    if (!userId) return;

    onlineUsers.delete(userId);
    lastSeenMap[userId] = new Date().toISOString();

    io.emit('presence-update', {
      onlineUsers: Array.from(onlineUsers),
      lastSeen: lastSeenMap,
    });

    console.log('Disconnected:', userId);
  });
});

server.listen(PORT, () => {
  console.log(`Socket server running on ${PORT}`);
});

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // Handle new post event
  socket.on('newPost', (newPost) => {
    console.log('New post created:', newPost);
    io.emit('newPost', newPost); // Broadcast the new post to all clients
  });

  // Handle update post event
  socket.on('updatePost', (updatedPost) => {
    console.log('Post updated:', updatedPost);
    io.emit('updatePost', updatedPost); // Broadcast the updated post to all clients
  });

  // Handle delete post event
  socket.on('deletePost', (deletedPostId) => {
    console.log('Post deleted:', deletedPostId);
    io.emit('deletePost', deletedPostId); // Broadcast the deleted post ID to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };

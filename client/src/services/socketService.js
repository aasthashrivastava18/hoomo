// src/services/socketService.js
import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit('join_room', roomId);
  }
};

export const sendMessage = (roomId, message) => {
  if (socket) {
    socket.emit('send_message', { roomId, message });
  }
};

export const onMessageReceived = (callback) => {
  if (socket) {
    socket.on('receive_message', callback);
  }
};


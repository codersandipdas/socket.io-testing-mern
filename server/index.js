const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected, id: ', socket.id);

  socket.on('join_room', (id) => {
    socket.join(id);
    console.log(`User with id ${socket.id} joined the room ${id}`);
  });

  socket.on('send__msg', (data) => {
    socket.to(data.roomId).emit('receive_msg', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected, id: ', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Server running at port 4000');
});

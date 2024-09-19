const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const loginRoutes = require('./routes/loginRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');

app.use(cors());

const server = http.createServer(app);
const users = [];
const groups = {}; // Store group data

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('files'), (req, res) => {
    const files = req.files.map(file => ({
        originalname: file.originalname,
        filename: file.filename
    }));
    res.json({ files });
});

app.use(express.json());

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('login', (username) => {
    users.push({ id: socket.id, username: username });
    io.emit("update_users", users);
  });

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    const { message, sender, room, files } = data;
    if (room) {
      io.to(room).emit('receive_message', data);
    } else {
      io.emit('receive_message', data);
    }
  });

  socket.on('createGroup', ({ groupName, members }) => {
    if (!groups[groupName]) {
      groups[groupName] = { members, messages: [] };
      members.forEach(member => {
        const userSocket = users.find(user => user.username === member);
        if (userSocket) {
          io.to(userSocket.id).emit('update_group', { groupName, members });
        }
      });
      console.log(`Group created: ${groupName}`);
    }
  });

  socket.on('disconnect', () => {
    const index = users.findIndex(user => user.id === socket.id);
    if (index !== -1) {
      console.log(`${users[index].username} has disconnected`);
      users.splice(index, 1);
      io.emit("update_users", users);
    }
  });
});

app.use('/files', express.static(path.join(__dirname, 'uploads')));

app.use('/api/login', loginRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/group', groupRoutes);

const DB = "mongodb://mongoadmin:mongoadmin@localhost:27017/chatapp?authSource=admin";

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});

server.listen(5000, () => {
  console.log("SERVER IS RUNNING");
});

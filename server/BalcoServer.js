const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection (optional - comment out if not using database yet)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livesync', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Store active rooms and their data in memory
const fs = require('fs');
const path = require('path');

// Persistence setup
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Load rooms from file
let rooms = new Map();

function loadRooms() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const roomsObj = JSON.parse(data);
      // Convert object back to Map
      rooms = new Map(Object.entries(roomsObj));
      console.log(`Loaded ${rooms.size} rooms from storage`);
    }
  } catch (error) {
    console.error('Error loading rooms:', error);
    rooms = new Map();
  }
}

function saveRooms() {
  try {
    // Convert Map to object for JSON storage
    const roomsObj = Object.fromEntries(rooms);
    fs.writeFileSync(DATA_FILE, JSON.stringify(roomsObj, null, 2));
  } catch (error) {
    console.error('Error saving rooms:', error);
  }
}

// Load initial state
loadRooms();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);

    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        name: 'Untitled Room',
        notes: [],
        connections: []
      });
      saveRooms();
    }

    // Send current room state to the new user
    socket.emit('room-state', rooms.get(roomId));

    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId: socket.id });
  });

  // Create or update a sticky note
  socket.on('update-note', ({ roomId, note }) => {
    const room = rooms.get(roomId);
    if (room) {
      const existingIndex = room.notes.findIndex(n => n.id === note.id);
      if (existingIndex !== -1) {
        room.notes[existingIndex] = note;
      } else {
        room.notes.push(note);
      }
      saveRooms();

      // Broadcast to all users in the room except sender
      socket.to(roomId).emit('note-updated', note);
    }
  });

  // Delete a sticky note
  socket.on('delete-note', ({ roomId, noteId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.notes = room.notes.filter(n => n.id !== noteId);
      socket.to(roomId).emit('note-deleted', noteId);
      saveRooms();
    }
  });

  // Create or update a connection between notes
  socket.on('update-connection', ({ roomId, connection }) => {
    const room = rooms.get(roomId);
    if (room) {
      const existingIndex = room.connections.findIndex(c => c.id === connection.id);
      if (existingIndex !== -1) {
        room.connections[existingIndex] = connection;
      } else {
        room.connections.push(connection);
      }
      saveRooms();

      socket.to(roomId).emit('connection-updated', connection);
    }
  });

  // Delete a connection
  socket.on('delete-connection', ({ roomId, connectionId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.connections = room.connections.filter(c => c.id !== connectionId);
      socket.to(roomId).emit('connection-deleted', connectionId);
      saveRooms();
    }
  });

  // Update room name
  socket.on('update-room-name', ({ roomId, name }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.name = name;
      socket.to(roomId).emit('room-name-updated', name);
      saveRooms();
    }
  });

  // Handle cursor movement for real-time collaboration awareness
  socket.on('cursor-move', ({ roomId, position }) => {
    socket.to(roomId).emit('user-cursor', {
      userId: socket.id,
      position
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 1000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

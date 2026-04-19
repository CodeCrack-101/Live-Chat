import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { connectdb } from './LIb/DB.js';
import http from 'http';
import userrouter from './Routes/Userroute.js';
import messagerouter from './Routes/messageroute.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// ✅ CORS: Must match frontend when using credentials
const CLIENT_ORIGIN = "http://localhost:5173";

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "4mb" }));

// ✅ Socket.io CORS must also match frontend origin (not "*")
export const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true
  }
});

// Store online users
export const usersockitmap = {};

// Connect to socket.io
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🔌 User Connected:", userId);

  if (userId) {
    usersockitmap[userId] = socket.id;
    io.emit("Get Online User", Object.keys(usersockitmap));
  }

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", userId);
    delete usersockitmap[userId];
    io.emit("Get Online User", Object.keys(usersockitmap));
  });
});

// Routes
app.use('/api/status', (req, res) => {
  res.send("server is live");
});
app.use('/api/auth', userrouter);
app.use('/api/messages', messagerouter);

// Connect DB
await connectdb();

if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

// For Vercel export
export default server;

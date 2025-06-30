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

// Initialize socket server
export const io = new Server(server, {  // ✅ FIX: use 'server', not 'Server'
  cors: {
    origin: "*",
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


// Middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// Routes
app.use('/api/status', (req, res) => {
  res.send("server is live");
});
app.use('/api/auth', userrouter);
app.use('/api/messages', messagerouter);

// Database
await connectdb(); // ✅ ensure this is inside an ES module (type: module)

// Start the server
if(process.env.NODE_ENV !== "production")
{
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

//export for vercel
export default server;

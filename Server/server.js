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

// Middleware
app.use(express.json({ limit: "4mb" }));

const allowedOrigins = [
  "http://localhost:5173",   // ✅ ADD THIS
  "http://localhost:5174",
  "https://live-chat-eosin-rho.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Socket
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Default
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// Routes
app.use("/api/auth", userrouter);
app.use("/api/messages", messagerouter);

// Users map
export const usersockitmap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId || null;

  if (userId) {
    usersockitmap[userId] = socket.id;
    io.emit("Get Online User", Object.keys(usersockitmap));
  }

  socket.on("disconnect", () => {
    delete usersockitmap[userId];
    io.emit("Get Online User", Object.keys(usersockitmap));
  });
});

// DB + Server
connectdb()
  .then(() => {
    console.log("✅ DB Connected");
    server.listen(port, () => {
      console.log(`🚀 Server running on ${port}`);
    });
  })
  .catch(err => console.log(err));

export default server;
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

// ✅ Allowed frontend origins (local + production)
const allowedOrigins = [
  "http://localhost:5174",                        // local frontend
  "https://live-chat-eosin-rho.vercel.app"        // deployed frontend
];

// ✅ Express CORS middleware (must be first)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Explicitly handle preflight requests
app.options("*", cors());

app.use(express.json({ limit: "4mb" }));

// ✅ Socket.io CORS config
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Default route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Store online users
export const usersockitmap = {};

// Socket.io events
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(" User Connected:", userId);

  if (userId) {
    usersockitmap[userId] = socket.id;
    io.emit("Get Online User", Object.keys(usersockitmap));
  }

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete usersockitmap[userId];
    io.emit("Get Online User", Object.keys(usersockitmap));
  });
});

// Routes
app.use("/api/status", (req, res) => {
  res.send("server is live");
});
app.use("/api/auth", userrouter);
app.use("/api/messages", messagerouter);

// Connect DB
connectdb().then(() => console.log("✅ DB connected")).catch(err => console.error("❌ DB error", err));

// Start server locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

// ✅ For Vercel export
export default server;

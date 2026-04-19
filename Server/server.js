import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectdb } from "./LIb/DB.js";
import userrouter from "./Routes/Userroute.js";
import messagerouter from "./Routes/messageroute.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;


// ✅ Allowed origins (ADD YOUR VERCEL URL HERE)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://live-chat-two-psi.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Body parsers
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));


// =======================
// ✅ ROUTES
// =======================

app.get("/", (req, res) => {
  res.send("Server running ✅");
});

app.use("/api/auth", userrouter);
app.use("/api/messages", messagerouter);


// =======================
// ✅ SOCKET.IO (FIXED)
// =======================

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const usersockitmap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    usersockitmap[userId] = socket.id;
    io.emit("Get Online User", Object.keys(usersockitmap));
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete usersockitmap[userId];
      io.emit("Get Online User", Object.keys(usersockitmap));
    }
  });
});


// =======================
// ✅ DB + SERVER START
// =======================

connectdb()
  .then(() => {
    console.log("✅ DB Connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB Error:", err));

export default server;
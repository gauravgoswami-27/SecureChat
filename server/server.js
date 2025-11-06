// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import authRoutes from "./routes/auth.js";
// import chatRoutes from "./routes/chat.js";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/chat", chatRoutes); // 👈 IMPORTANT — prefix me "api" add karo

// const PORT = process.env.PORT || 5000;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes); // 👈 corrected path (frontend bhi /api/chat use karega)

// HTTP + Socket.io setup
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 👈 Vite frontend URL (change if needed)
    methods: ["GET", "POST"],
  },
});

// 🧠 Socket.io logic
const users = new Map();

io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("join", ({ username, publicKey }) => {
    users.set(username, { id: socket.id, publicKey });
    console.log(`✅ ${username} joined`);
    io.emit(
      "users",
      Array.from(users.entries()).map(([name, data]) => ({
        username: name,
        publicKey: data.publicKey,
      }))
    );
  });

  socket.on("encrypted-message", (data) => {
    const recipient = users.get(data.to);
    if (recipient) {
      io.to(recipient.id).emit("encrypted-message", {
        from: data.from,
        ciphertext: data.ciphertext,
        nonce: data.nonce,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [username, data] of users.entries()) {
      if (data.id === socket.id) users.delete(username);
    }
    io.emit(
      "users",
      Array.from(users.entries()).map(([name, data]) => ({
        username: name,
        publicKey: data.publicKey,
      }))
    );
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Mongo + Server Start
const PORT = 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

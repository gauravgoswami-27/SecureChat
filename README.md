# 🔐 Secure Chat App

A real-time, end-to-end secure chat application built using *Node.js, **Express, **MongoDB, **Mongoose, **Socket.IO, and **JWT authentication*.  
It supports *secure user registration, **login, **private messaging, and **instant message delivery* with Socket.IO.

---

## 🚀 Features

- 🔑 *User Authentication*
  - Register & Login with JWT
  - Password hashing using bcrypt
- 📡 *Real-time Messaging*
  - Socket.IO for bi-directional communication
  - Sends & receives messages instantly
- 🔐 *Secure Chat*
  - Messages stored with ciphertext & nonce
  - Timestamp saved for each message
- 👤 *User Presence*
  - Online/offline user tracking (via sockets)
- 🗂 *MongoDB Storage*
  - Users & Chats stored in MongoDB
- 🧱 *Modular Backend Structure*
  - Routes folder (auth, chat)
  - Controllers, middlewares, models

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time | Socket.IO |
| Authentication | JWT, bcrypt |
| Others | CORS, dotenv |

---



🔐 Login Requirement (Important)

This is a real-time chat application, so:

✅ You must open the app in two browsers / two tabs / two devices
✅ Login with two different user accounts

Only then you can test:

Real-time message sending

Online/offline status

Socket events

Encrypted chat storage

🧪 Testing Steps

Register User A

Register User B

Login User A in one browser

Login User B in another browser

Send messages → You’ll see instant updates

# 🔐 Secure Chat App

A real-time, end-to-end secure chat application built using *Node.js, **Express, **MongoDB, **Mongoose, **Socket.IO, and **JWT authentication*.  
It supports *secure user registration, **login, **private messaging, and **instant message delivery* with Socket.IO.

---
![WhatsApp Image 2025-11-14 at 12 10 52_e16cb64f](https://github.com/user-attachments/assets/03412277-1a60-4b0e-9e90-0c584ce45dec)

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



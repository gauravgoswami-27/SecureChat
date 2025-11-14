🔐 Login Requirement (Important)

This is a real-time chat application, so:

✅ You **must** open the app in **two browsers** / two tabs / two devices
✅ Login with two different user accounts

->Only then you can test:

->Real-time message sending

->Online/offline status

->Socket events

->Encrypted chat storage

🧪 Testing Steps

1.Register User A
<img width="1919" height="921" alt="Screenshot 2025-11-06 222500" src="https://github.com/user-attachments/assets/4d60cf51-f007-4939-a2db-385a08402f85" />


2.Register User B
![WhatsApp Image 2025-11-14 at 12 29 01_72557b03](https://github.com/user-attachments/assets/41dc3c76-451c-40a5-a817-48edc34e3ab3)


3.Login User A in one browser
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/a54f0148-0ee1-4b7b-9ea2-f055509b74c7" />


4.Login User B in another browser
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/12df58cd-4408-443f-885b-7e20ae1efb97" />


Send messages → You’ll see instant updates
![WhatsApp Image 2025-11-14 at 12 10 52_e16cb64f](https://github.com/user-attachments/assets/03412277-1a60-4b0e-9e90-0c584ce45dec)

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



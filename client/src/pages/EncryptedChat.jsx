// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { MessageSquare, Lock, Users, Send, Loader } from "lucide-react";
// import io from "socket.io-client";
// import sodium from "libsodium-wrappers";
// import Navbar from "../components/Navbar";
// import "./EncryptedChat.css";

// function EncryptedChat() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState({});
//   const [inputMessage, setInputMessage] = useState("");
//   const [keyPair, setKeyPair] = useState(null);
//   const [userPublicKeys, setUserPublicKeys] = useState({});
//   const [sodiumReady, setSodiumReady] = useState(false);
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const userPublicKeysRef = useRef({});
//   const back = "http://localhost:3000";

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");
//     if (!token || !user) {
//       alert("You must login first to access encrypted chat.");
//       navigate("/login");
//       return;
//     }
//     const userData = JSON.parse(user);
//     setUsername(userData.username);
//   }, [navigate]);

//   useEffect(() => {
//     const initSodium = async () => {
//       await sodium.ready;
//       setSodiumReady(true);
//     };
//     initSodium();
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, selectedUser]);

//   const generateKeyPair = () => {
//     const pair = sodium.crypto_box_keypair();
//     return {
//       publicKey: sodium.to_base64(pair.publicKey),
//       privateKey: sodium.to_base64(pair.privateKey),
//     };
//   };

//   const encryptMessage = (message, recipientPublicKey, senderPrivateKey) => {
//     const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
//     const publicKey = sodium.from_base64(recipientPublicKey);
//     const privateKey = sodium.from_base64(senderPrivateKey);
//     const cipher = sodium.crypto_box_easy(message, nonce, publicKey, privateKey);
//     return {
//       ciphertext: sodium.to_base64(cipher),
//       nonce: sodium.to_base64(nonce),
//     };
//   };

//   const decryptMessage = (ciphertext, nonce, senderPublicKey, recipientPrivateKey) => {
//     const cipher = sodium.from_base64(ciphertext);
//     const nonceBytes = sodium.from_base64(nonce);
//     const pubKey = sodium.from_base64(senderPublicKey);
//     const privKey = sodium.from_base64(recipientPrivateKey);
//     const decrypted = sodium.crypto_box_open_easy(cipher, nonceBytes, pubKey, privKey);
//     return sodium.to_string(decrypted);
//   };

//   const joinChat = async () => {
//     if (!username.trim() || !sodiumReady) return;
//     try {
//       const keys = generateKeyPair();
//       setKeyPair(keys);
//       const socket = io(back);
//       socketRef.current = socket;

//       socket.emit("join", { username, publicKey: keys.publicKey });

//       socket.on("users", (userList) => {
//         setUsers(userList.filter((u) => u.username !== username));
//         const pubKeys = {};
//         userList.forEach((u) => {
//           if (u.username !== username) pubKeys[u.username] = u.publicKey;
//         });
//         setUserPublicKeys(pubKeys);
//         userPublicKeysRef.current = pubKeys;
//       });

//       socket.on("encrypted-message", (data) => {
//         try {
//           if (
//             !data?.ciphertext ||
//             !data?.nonce ||
//             !data?.from ||
//             !keys?.privateKey ||
//             !userPublicKeysRef.current[data.from]
//           ) {
//             console.warn("Skipping decryption, missing data");
//             return;
//           }

//           const decrypted = decryptMessage(
//             data.ciphertext,
//             data.nonce,
//             userPublicKeysRef.current[data.from],
//             keys.privateKey
//           );

//           setMessages((prev) => ({
//             ...prev,
//             [data.from]: [
//               ...(prev[data.from] || []),
//               { text: decrypted, from: data.from, timestamp: new Date() },
//             ],
//           }));
//         } catch (err) {
//           console.error("Decryption failed:", err);
//         }
//       });

//       setJoined(true);
//     } catch (err) {
//       console.error("Join failed:", err);
//       alert("Failed to join chat. Please refresh and try again.");
//     }
//   };

//   const sendMessage = () => {
//     if (!inputMessage.trim() || !selectedUser) return;
//     try {
//       const encrypted = encryptMessage(
//         inputMessage,
//         userPublicKeys[selectedUser],
//         keyPair.privateKey
//       );

//       socketRef.current.emit("encrypted-message", {
//         to: selectedUser,
//         ciphertext: encrypted.ciphertext,
//         nonce: encrypted.nonce,
//       });

//       setMessages((prev) => ({
//         ...prev,
//         [selectedUser]: [
//           ...(prev[selectedUser] || []),
//           { text: inputMessage, from: username, timestamp: new Date() },
//         ],
//       }));

//       setInputMessage("");
//     } catch (err) {
//       console.error("Encryption failed:", err);
//     }
//   };

//   if (!sodiumReady) {
//     return (
//       <>
//         <Navbar />
//         <div className="loading-screen">
//           <div className="loading-box">
//             <Loader className="loading-icon" />
//             <h2>Loading Encryption...</h2>
//             <p>Initializing libsodium library</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (!joined) {
//     joinChat();
//     // return (
      
//     //   <>
//     //     <Navbar />
//     //     <div className="join-screen">
//     //       <div className="join-box">
//     //         <div className="icon-center">
//     //           <Lock className="join-icon" />
//     //         </div>
//     //         <h1>E2E Encrypted Chat</h1>
//     //         <p className="subtitle">Zero-knowledge messaging with libsodium</p>

//     //         <div className="user-info">
//     //           <p><strong>Logged in as:</strong> {username}</p>
//     //         </div>

//     //         <button onClick={joinChat} disabled={!sodiumReady} className="join-btn">
//     //           <MessageSquare /> Enter Encrypted Chat Room
//     //         </button>

//     //         <div className="info-box">
//     //           <p>
//     //             🔐 <strong>End-to-End Encrypted:</strong> Messages are encrypted on your device.
//     //           </p>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </>
//     // );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="chat-container">
//         <div className="sidebar">
//           <div className="sidebar-header">
//             <Lock />
//             <h2>Secure Chat</h2>
//             <p>Logged in as {username}</p>
//           </div>
//           <div className="user-list-header">
//             <Users />
//             <span>Online Users ({users.length})</span>
//           </div>

//           <div className="user-list">
//             {users.length === 0 ? (
//               <div className="no-users">
//                 <p>No other users online</p>
//                 <p>Wait for others to join!</p>
//               </div>
//             ) : (
//               users.map((user) => (
//                 <button
//                   key={user.username}
//                   onClick={() => setSelectedUser(user.username)}
//                   className={`user-button ${
//                     selectedUser === user.username ? "active" : ""
//                   }`}
//                 >
//                   <div className="user-avatar">
//                     {user.username[0].toUpperCase()}
//                   </div>
//                   <div className="user-details">
//                     <p className="username">{user.username}</p>
//                     <p className="status">● Online</p>
//                   </div>
//                 </button>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="chat-area">
//           {selectedUser ? (
//             <>
//               <div className="chat-header">
//                 <div className="chat-avatar">
//                   {selectedUser[0].toUpperCase()}
//                 </div>
//                 <div>
//                   <h3>{selectedUser}</h3>
//                   <p className="encrypted-label">🔒 End-to-end encrypted</p>
//                 </div>
//               </div>

//               <div className="messages">
//                 {(messages[selectedUser] || []).map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`message ${msg.from === username ? "sent" : "received"}`}
//                   >
//                     <div className="message-bubble">
//                       <p>{msg.text}</p>
//                       <span className="timestamp">
//                         {msg.timestamp.toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="message-input">
//                 <input
//                   type="text"
//                   placeholder="Type a message..."
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                 />
//                 <button onClick={sendMessage}>
//                   <Send />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="empty-chat">
//               <MessageSquare />
//               <p>Select a user to start chatting</p>
//               <span>All messages are end-to-end encrypted</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default EncryptedChat;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Lock, Users, Send, Loader } from "lucide-react";
import io from "socket.io-client";
import sodium from "libsodium-wrappers";
import Navbar from "../components/Navbar";
import API from "../api";
import "./EncryptedChat.css";

function EncryptedChat() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [keyPair, setKeyPair] = useState(null);
  const [userPublicKeys, setUserPublicKeys] = useState({});
  const [sodiumReady, setSodiumReady] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userPublicKeysRef = useRef({});
  const keyPairRef = useRef(null);
  const back = "http://localhost:5000";
  
  // 🧠 Load logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      alert("You must login first to access encrypted chat.");
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    setUsername(userData.username);
  }, [navigate]);

  // 🔐 Initialize sodium
  useEffect(() => {
    const initSodium = async () => {
      await sodium.ready;
      setSodiumReady(true);
    };
    initSodium();
  }, []);

  // Auto scroll down
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  // 🧩 Generate keypair
  const generateKeyPair = () => {
    const pair = sodium.crypto_box_keypair();
    return {
      publicKey: sodium.to_base64(pair.publicKey),
      privateKey: sodium.to_base64(pair.privateKey),
    };
  };

  // 🔒 Encrypt message
  const encryptMessage = (message, recipientPublicKey, senderPrivateKey) => {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const publicKey = sodium.from_base64(recipientPublicKey);
    const privateKey = sodium.from_base64(senderPrivateKey);
    const cipher = sodium.crypto_box_easy(message, nonce, publicKey, privateKey);
    return {
      ciphertext: sodium.to_base64(cipher),
      nonce: sodium.to_base64(nonce),
    };
  };

  // 🔓 Decrypt message
  const decryptMessage = (ciphertext, nonce, senderPublicKey, recipientPrivateKey) => {
    const cipher = sodium.from_base64(ciphertext);
    const nonceBytes = sodium.from_base64(nonce);
    const pubKey = sodium.from_base64(senderPublicKey);
    const privKey = sodium.from_base64(recipientPrivateKey);
    const decrypted = sodium.crypto_box_open_easy(cipher, nonceBytes, pubKey, privKey);
    return sodium.to_string(decrypted);
  };

  // 🚀 Join chat room
 const joinChat = async () => {
  if (!username.trim() || !sodiumReady) return;

  try {
    // ✅ Check if we already have a stored keypair
    let storedKeys = localStorage.getItem(`keys_${username}`);
    let keys;

    if (storedKeys) {
      keys = JSON.parse(storedKeys);
      console.log("🔑 Loaded saved keypair for", username);
    } else {
      // 🆕 First time user — generate new keypair
      keys = generateKeyPair();
      localStorage.setItem(`keys_${username}`, JSON.stringify(keys));
      console.log("🆕 New keypair generated for", username);
    }

    setKeyPair(keys);
    keyPairRef.current = keys;

    // 🔌 Connect socket (only once)
    if (!socketRef.current) {
      socketRef.current = io(back);
    }
    const socket = socketRef.current;

    socket.emit("join", { username, publicKey: keys.publicKey });

    socket.on("users", (userList) => {
      setUsers(userList.filter((u) => u.username !== username));
      const pubKeys = {};
      userList.forEach((u) => {
        if (u.username !== username) pubKeys[u.username] = u.publicKey;
      });
      setUserPublicKeys(pubKeys);
      userPublicKeysRef.current = pubKeys;
    });

    socket.on("encrypted-message", (data) => {
      try {
        if (
          !data?.ciphertext ||
          !data?.nonce ||
          !data?.from ||
          !keyPairRef.current?.privateKey ||
          !userPublicKeysRef.current[data.from]
        ) {
          console.warn("Skipping decryption, missing data");
          return;
        }

        const decrypted = decryptMessage(
          data.ciphertext,
          data.nonce,
          userPublicKeysRef.current[data.from],
          keyPairRef.current.privateKey
        );

        setMessages((prev) => ({
          ...prev,
          [data.from]: [
            ...(prev[data.from] || []),
            { text: decrypted, from: data.from, timestamp: new Date() },
          ],
        }));
      } catch (err) {
        console.error("Decryption failed:", err);
      }
    });

    setJoined(true);
  } catch (err) {
    console.error("Join failed:", err);
    alert("Failed to join chat. Please refresh and try again.");
  }
};

  // 💬 Send message (with DB save)
  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedUser || !keyPair) return;
    
    const messageToSend = inputMessage.trim();
    setInputMessage(""); // Clear input immediately
    
    try {
      const encrypted = encryptMessage(
        messageToSend,
        userPublicKeys[selectedUser],
        keyPair.privateKey
      );

      // Show message in UI instantly
      setMessages((prev) => ({
        ...prev,
        [selectedUser]: [
          ...(prev[selectedUser] || []),
          { text: messageToSend, from: username, timestamp: new Date() },
        ],
      }));

      // Emit to socket
      socketRef.current.emit("encrypted-message", {
  to: selectedUser,
  from: username, // ✅ also include sender (some servers need it)
  ciphertext: encrypted.ciphertext,
  nonce: encrypted.nonce,
});


      // 🧠 Save encrypted message to DB (async, non-blocking)
      API.post("/chat/save", {
        from: username,
        to: selectedUser,
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce,
      }).catch(err => {
        console.error("Failed to save message to DB:", err);
      });

    } catch (err) {
      console.error("Encryption or send failed:", err);
      // Optionally restore the message on error
      setInputMessage(messageToSend);
    }
  };

  // 📜 Load chat history when user selected
  const loadChatHistory = async (user2) => {
    setSelectedUser(user2);
    
    if (!keyPairRef.current) {
      console.warn("KeyPair not ready yet");
      return;
    }

    try {
      const res = await API.get(`/chat/get/${username}/${user2}`);
      const chatData = res.data;

      const decryptedMsgs = chatData
        .map((msg) => {
          try {
            // Determine who sent the message to get correct public key
            const senderPublicKey = msg.from === username 
              ? userPublicKeysRef.current[user2] 
              : userPublicKeysRef.current[msg.from];

            if (!senderPublicKey) {
              console.warn("Missing public key for", msg.from);
              return null;
            }

            const text = decryptMessage(
              msg.ciphertext,
              msg.nonce,
              senderPublicKey,
              keyPairRef.current.privateKey
            );
            
            return {
              text,
              from: msg.from,
              timestamp: new Date(msg.timestamp),
            };
          } catch (err) {
            console.warn("Decryption failed for message", msg._id, err);
            return null;
          }
        })
        .filter(Boolean);

      setMessages((prev) => ({
        ...prev,
        [user2]: decryptedMsgs,
      }));
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 🔄 Loading state
  if (!sodiumReady) {
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="loading-box">
            <Loader className="loading-icon" />
            <h2>Loading Encryption...</h2>
            <p>Initializing libsodium library</p>
          </div>
        </div>
      </>
    );
  }

  // 🏁 Join automatically once ready
  if (!joined) {
    joinChat();
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="loading-box">
            <Loader className="loading-icon" />
            <h2>Connecting to Chat...</h2>
            <p>Establishing secure connection</p>
          </div>
        </div>
      </>
    );
  }
function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ""; // protect invalid date

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      // aaj ka message
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // purana message
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch (err) {
    console.error("Error formatting date:", err);
    return "";
  }
}

  // 🧩 UI
  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="sidebar">
          <div className="sidebar-header">
           <span className="lock-icon"> <Lock />
            <h2>Secure Chat</h2></span>
            <p>Logged in as {username}</p>
          </div>
          <div className="user-list-header">
            <Users />
            <span>Online Users ({users.length})</span>
          </div>

          <div className="user-list">
            {users.length === 0 ? (
              <div className="no-users">
                <p>No other users online</p>
                <p>Wait for others to join!</p>
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.username}
                  onClick={() => loadChatHistory(user.username)}
                  className={`user-button ${
                    selectedUser === user.username ? "active" : ""
                  }`}
                >
                  <div className="user-avatar">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="user-details">
                    <p className="username">{user.username}</p>
                    <p className="status">● Online</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="chat-area">
          {selectedUser ? (
            <>
              <div className="chat-header">
                <div className="chat-avatar">
                  {selectedUser[0].toUpperCase()}
                </div>
                <div>
                  <h3>{selectedUser}</h3>
                  <p className="encrypted-label">🔒 End-to-end encrypted</p>
                </div>
              </div>

              <div className="messages">
                {(messages[selectedUser] || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.from === username ? "sent" : "received"}`}
                  >
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span className="timestamp">
  {msg.timestamp
    ? new Date(msg.timestamp).toLocaleString([], {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""}
</span>


                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={sendMessage} disabled={!inputMessage.trim()}>
                  <Send />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-chat">
              <MessageSquare />
              <p>Select a user to start chatting</p>
              <span>All messages are end-to-end encrypted</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EncryptedChat;
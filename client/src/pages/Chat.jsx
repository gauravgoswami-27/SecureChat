import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// import "./Chat.css";

function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must register or login first to access the chat.");
      navigate("/register");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <h2>Welcome to the Chat Room 💬</h2>
        <p>Start chatting with your friends in real time!</p>
      </div>
    </>
  );
}
export default Chat;
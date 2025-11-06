import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleGoToChat = () => {
    if (token) {
      navigate("/chat");
    } else {
      alert("Please register or login first to use the Chat.");
      navigate("/register");
    }
  };

  const handleGoToEncryptedChat = () => {
    if (token) {
      navigate("/encrypted-chat");
    } else {
      alert("Please register or login first to use Encrypted Chat.");
      navigate("/register");
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="welcome-box">
          <h1>
            Welcome to <span className="highlight">ChatApp 💭</span>
          </h1>
          <p>Connect with friends in real time — anytime, anywhere.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {/* <button onClick={handleGoToChat} className="chat-button">
              💬 Go to Regular Chat
            </button> */}
            <button 
              onClick={handleGoToEncryptedChat} 
              className="chat-button"
              style={{ background: '#8b5cf6' }}
            >
              🔐 Go to Encrypted Chat
            </button>
          </div>

          {!token && (
            <p className="warning" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              ⚠️ You must login to access chat features
            </p>
          )}
        </div>
      </div>
    </>
  );
}
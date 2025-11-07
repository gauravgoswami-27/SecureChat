import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home, MessageSquare } from "lucide-react";
import "./Navbar.css"; // You'll need to create this

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userStr = localStorage.getItem("user");
  let username = "";
  
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      username = userData.username || "";
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Clear all localStorage
      localStorage.clear();
      
      // Redirect to login
      navigate("/login", { replace: true });
      
      // Optional: Reload to clear any remaining state
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <MessageSquare size={24} />
          <span>SecureChat</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <Home size={20} />
            <span>Home</span>
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/encrypted-chat" className="navbar-link">
                <MessageSquare size={20} />
                <span>Chat</span>
              </Link>
              
              <div className="navbar-user">
                <span className="username-display">👤 {username}</span>
              </div>

              <button onClick={handleLogout} className="navbar-logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link navbar-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
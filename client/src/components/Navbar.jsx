// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     alert("✅ Logged out successfully");
//     navigate("/login");
//   };

//   return (
//     <nav style={styles.nav}>
//       <h2 style={styles.logo}>
//         <Link to="/" style={{ color: "#3b82f6", textDecoration: "none" }}>
//           💭 ChatApp
//         </Link>
//       </h2>
//       <div style={styles.links}>
//         <Link to="/" style={styles.link}>
//           Home
//         </Link>
//         {token ? (
//           <>
//             {/* <Link to="/chat" style={styles.link}>
//               Chat
//             </Link> */}
//             <Link to="/encrypted-chat" style={styles.link}>
//               🔐 Encrypted Chat
//             </Link>
//             <button onClick={handleLogout} style={styles.button}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" style={styles.link}>
//               Login
//             </Link>
//             <Link to="/register" style={styles.link}>
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// const styles = {
//   nav: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "rgba(15, 23, 42, 0.95)",
//     padding: "1rem 2rem",
//     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
//     position: "sticky",
//     top: 0,
//     backdropFilter: "blur(12px)",
//     zIndex: 10,
//   },
//   logo: {
//     color: "#3b82f6",
//     fontSize: "1.5rem",
//     margin: 0,
//   },
//   links: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1.5rem",
//   },
//   link: {
//     color: "#f1f5f9",
//     textDecoration: "none",
//     fontWeight: 500,
//     transition: "color 0.3s",
//   },
//   button: {
//     background: "#3b82f6",
//     border: "none",
//     color: "white",
//     padding: "0.5rem 1rem",
//     borderRadius: "12px",
//     cursor: "pointer",
//     fontWeight: 600,
//     transition: "all 0.3s",
//   },
// };

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
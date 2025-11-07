import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import CryptoJS from "crypto-js";
import Navbar from "../components/Navbar";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear form fields on mount
    setData({ username: "", password: "" });
    
    // Clear autofill
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      input.setAttribute('autocomplete', 'off');
    });
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔵 Sending login request with:", { username: data.username });
      
      // Send login credentials
      const res = await API.post("/auth/login", {
        username: data.username,
        password: data.password,
      });

      console.log("✅ Backend response:", res.data);

      const { username, publicKey, encryptedPrivateKey } = res.data;

      // Validate response
      if (!username || !publicKey || !encryptedPrivateKey) {
        throw new Error("Missing required fields from backend");
      }

      // Decrypt private key using password
      console.log("🔐 Decrypting private key...");
      const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, data.password);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);

      if (!privateKey || privateKey.length === 0) {
        alert("❌ Failed to decrypt private key. Wrong password!");
        setLoading(false);
        return;
      }

      // Store user data (this is what EncryptedChat expects)
      const userData = {
        username,
        publicKey,
        privateKey
      };

      console.log("💾 Storing user data...");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", "dummy-token"); // EncryptedChat checks for this
      localStorage.setItem("isLoggedIn", "true");
      
      // Also store the keypair in the format EncryptedChat expects
      localStorage.setItem(`keys_${username}`, JSON.stringify({
        publicKey,
        privateKey
      }));

      console.log("✅ Login successful! Redirecting...");
      alert("✅ Login successful!");
      
      // Clear form
      setData({ username: "", password: "" });
      
      // Force clear inputs
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => input.value = '');
      
      // Redirect to encrypted chat
      setTimeout(() => {
        navigate("/encrypted-chat", { replace: true });
      }, 500);
      
    } catch (err) {
      console.error("❌ Login error:", err);
      
      let errorMessage = "Server error";
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage = "Cannot connect to server. Is the backend running?";
      } else {
        errorMessage = err.message;
      }
      
      alert(`❌ Login Failed\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (<>
  <Navbar />
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={data.username}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
          required
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#3b82f6", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  </>);
}

export default Login;
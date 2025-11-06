// import React, { useState, useEffect } from "react";
// import API from "../api";
// import { Link, useNavigate } from "react-router-dom";

// function Register() {
//   const [data, setData] = useState({ username: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Ensure fields are empty when component mounts
//   useEffect(() => {
//     setData({ username: "", email: "", password: "" });
//   }, []);

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await API.post("/auth/register", data);
//       alert(res.data.message || "User registered successfully ✅");

//       // ✅ Clear form fields
//       setData({ username: "", email: "", password: "" });

//       // ✅ Redirect to login page
//       navigate("/login");
//     } catch (err) {
//       console.error("Registration error:", err.response?.data || err.message);
//       alert(
//         `❌ Registration Failed\n${
//           err.response?.data?.message || "Server error"
//         }`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <form onSubmit={handleSubmit} className="form">
//         <h2>Register</h2>

//         <input
//           name="username"
//           placeholder="Full Name"
//           onChange={handleChange}
//           value={data.username}
//           required
//           autoComplete="off"
//         />

//         <input
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           value={data.email}
//           required
//           autoComplete="off"
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           value={data.password}
//           required
//           autoComplete="new-password"
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
//           Already have an account?{" "}
//           <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>
//             Login here
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Register;


import React, { useState, useEffect } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import sodium from "libsodium-wrappers";
import Navbar from "../components/Navbar";

function Register() {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setData({ username: "", email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Wait for libsodium to initialize
      await sodium.ready;

      // Generate Key Pair for E2EE
      const keyPair = sodium.crypto_box_keypair();
      const publicKey = sodium.to_base64(keyPair.publicKey);
      const privateKey = sodium.to_base64(keyPair.privateKey);

      // Encrypt the private key using user's password
      const encryptedPrivateKey = CryptoJS.AES.encrypt(
        privateKey,
        data.password
      ).toString();

      // Send to backend
      const res = await API.post("/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        publicKey,
        encryptedPrivateKey,
      });

      alert(res.data.message || "✅ Registration successful!");

      // Clear fields
      setData({ username: "", email: "", password: "" });

      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert(
        `❌ Registration Failed\n${
          err.response?.data?.message || err.response?.data?.error || "Server error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Register</h2>

        <input
          name="username"
          placeholder="Full Name"
          onChange={handleChange}
          value={data.username}
          required
          autoComplete="off"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={data.email}
          required
          autoComplete="off"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
          required
          autoComplete="new-password"
          minLength="6"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  </>);
}

export default Register;

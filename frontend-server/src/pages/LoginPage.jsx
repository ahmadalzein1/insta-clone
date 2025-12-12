import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", {
        emailOrUsername,
        password,
      });

      login(res.data.user, res.data.token);
    } catch (err) {
     
       console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Login</h2>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

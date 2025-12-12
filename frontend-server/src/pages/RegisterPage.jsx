import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx";


const RegisterPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/register", form);
      login(res.data.user, res.data.token);
    } catch (err) {
      console.error(err);
       
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Register</h2>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Create account</button>
      </form>
    </div>
  );
};

export default RegisterPage;

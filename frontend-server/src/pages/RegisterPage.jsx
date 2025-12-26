import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 new

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔒 extra safety

    setError("");
    setLoading(true); // 🔥 disable button

    try {
      await axios.post("/api/auth/register", form);
      navigate("/check-email", { state: { email: form.email } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Register failed");
      setLoading(false); // 🔥 re-enable on error
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
          disabled={loading}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      navigate("/login");
    } catch (err) {
      setMessage("Invalid or expired link");
    }
  };
if(!token) return <p>invalid access</p>
  return (
    <form onSubmit={submit}>
      <h2>Reset password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Reset password</button>
      {message && <p>{message}</p>}
    </form>
  );
}

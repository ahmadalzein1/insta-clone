import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function CheckEmailPage() {
  const { state } = useLocation();
  const email = state?.email;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/auth/resend-verification", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p>Invalid access</p>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center" }}>
      <h2>Check your email 📧</h2>
      <p>
        We sent a verification link to <b>{email}</b>
      </p>

      <button onClick={resend} disabled={loading}>
        {loading ? "Sending..." : "didnt send yet?Resend email"}
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

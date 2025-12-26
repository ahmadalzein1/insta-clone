import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios
      .post(`/api/auth/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") return <p>Verifying...</p>;
  if (status === "error") return <p>Invalid or expired link</p>;

  return (
    <div>
      <h2>Email verified 🎉</h2>
      <Link to="/login">Login</Link>
    </div>
  );
}

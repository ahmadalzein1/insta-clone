import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AvatarUploader({ currentAvatar, onUpdated }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 PRO useEffect: manage object URL lifecycle
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url); // 🔥 prevent memory leaks
    };
  }, [file]);

  const submit = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("avatar", file);

    setLoading(true);
    await axios.put("/api/users/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setLoading(false);

    setFile(null);
    onUpdated(); // refresh profile
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <img
        src={
          preview
            ? preview
            : currentAvatar
            ? `${API}/uploads/${currentAvatar}`
            : "https://via.placeholder.com/120"
        }
        alt="avatar"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
          marginBottom: 8,
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {file && (
        <button onClick={submit} disabled={loading}>
          {loading ? "Uploading..." : "Save avatar"}
        </button>
      )}
    </div>
  );
}

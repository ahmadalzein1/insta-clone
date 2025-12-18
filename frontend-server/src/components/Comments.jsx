import { useState } from "react";
import axios from "axios";

export default function Comments({ postId, initialCount }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(Number(initialCount) || 0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // load ONLY when opening
  const loadComments = async () => {
    setLoading(true);
    const res = await axios.get(`/api/comments/${postId}`);
    setComments(res.data);
    setLoading(false);
  };

  const toggle = () => {
    if (!open) loadComments();
    setOpen(!open);
  };

  // 🔥 OPTIMISTIC + ROLLBACK
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const optimistic = {
      id: "temp-" + Date.now(),
      text,
      username: "you",
    };

    // 1️⃣ optimistic update
    setComments((prev) => [...prev, optimistic]);
    setCount((c) => c + 1);
    setText("");

    try {
      // 2️⃣ backend
      const res = await axios.post(`/api/comments/${postId}`, { text });

      // 3️⃣ replace temp with real comment
      setComments((prev) =>
        prev.map((c) => (c.id === optimistic.id ? res.data : c))
      );
    } catch (err) {
      console.error("Comment failed, rollback", err);

      // 4️⃣ rollback
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      setCount((c) => c - 1);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={toggle}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        💬 {count} {open ? "Hide" : "View"} comments
      </button>

      {open && (
        <div style={{ marginTop: 8 }}>
          {loading && <p>Loading...</p>}

          {!loading &&
            comments.map((c) => (
              <p key={c.id}>
                <strong>@{c.username}</strong> {c.text}
              </p>
            ))}

          <form onSubmit={submit} style={{ marginTop: 8 }}>
            <input
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </form>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

export default function Comments({ postId,onChange }) {
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    const res = await axios.get(`/api/comments/${postId}`);
    setComments(res.data);
    setLoading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await axios.post(`/api/comments/${postId}`, { text });
    setText("");
    loadComments();
  //  onChange();
  };

  const toggle = () => {
    if (!open) {
      loadComments(); // load ONLY when opening
    }
    setOpen(!open);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={toggle}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        💬 {open ? "Hide comments" : "View comments"}
      </button>

      {open && (
        <div style={{ marginTop: 8 }}>
          {loading && <p>Loading comments...</p>}

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

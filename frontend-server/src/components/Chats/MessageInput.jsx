import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        padding: 10,
        borderTop: "1px solid #ddd",
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

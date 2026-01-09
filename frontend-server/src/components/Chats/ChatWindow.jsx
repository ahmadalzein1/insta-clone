import { useEffect, useState } from "react";
import axios from "axios";
import MessageInput from "./MessageInput.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { createSocket } from "../../socket.js";

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // ---------------------------
  // Load messages
  // ---------------------------
  const loadMessages = async () => {
    if (!conversation) return;
    setLoading(true);
    const res = await axios.get(`/api/chat/messages/${conversation.id}`);
    setMessages(res.data);
    setLoading(false);
  };

  // ---------------------------
  // Socket lifecycle (AUTH)
  // ---------------------------
  // useEffect(() => {
  //   if (!token) return;

  //   createSocket(token);

  //   return () => {
  //     disconnectSocket();
  //   };
  // }, [token]);

  // ---------------------------
  // Chat room lifecycle
  // ---------------------------
  useEffect(() => {
    if (!conversation?.id) return;

    const socket = createSocket();

    const join = () => {

      socket.emit("join:conversation", conversation.id);
    };

    const leave = () => {
      socket.emit("leave:conversation", conversation.id);
    };

    const onMessage = (message) => {
      if (+message.conversation_id === conversation.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    // 🔥 initial join
    join();

    // 🔁 rejoin after reconnect
    socket.on("connect", join);

    // 📩 listen for messages
    socket.on("message:new", onMessage);

    return () => {
      socket.off("connect", join);
      socket.off("message:new", onMessage);
      leave(); // cleanup on convo change or unmount
    };
  }, [conversation?.id]);

  // ---------------------------
  // Reload messages on convo change
  // ---------------------------
  useEffect(() => {
    setMessages([]);
    if (conversation) loadMessages();
  }, [conversation?.id]);

  // ---------------------------
  // Send message
  // ---------------------------
  const sendMessage = async (text) => {
    await axios.post(`/api/chat/messages/${conversation.id}`, { text });
  };

if (!conversation) {
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
      <p>Select a chat to start messaging</p>
    </div>
  );
}


  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 10, borderBottom: "1px solid #ddd", fontWeight: "bold" }}>
        {conversation.is_group ? conversation.title : "Direct chat"}
      </div>

      <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
        {loading && <p>Loading...</p>}
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 6 }}>
            <strong>@{(m.sender_id===user.id)?'you':m.username}</strong>: {m.text}
          </div>
        ))}
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
}

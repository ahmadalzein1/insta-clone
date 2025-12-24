import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "../components/Chats/ChatWindow.jsx";
import ConversationList from "../components/Chats/ConversationList.jsx";



export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);




  const loadConversations = async () => {
    const res = await axios.get("/api/chat/conversations");
    setConversations(res.data);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="chat-layout" style={{ display: "flex" }} >
      <ConversationList
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelect={setActiveConversation}
      />

      <ChatWindow conversation={activeConversation} />
    </div>
  );
}

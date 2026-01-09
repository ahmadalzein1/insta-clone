import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "../components/Chats/ChatWindow.jsx";
import ConversationList from "../components/Chats/ConversationList.jsx";
import { useLocation } from "react-router-dom";
import { chatActiveRef } from "../ChatActiveRev.js";



export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

const location = useLocation();
const initialConversationId = location.state?.conversationId;



  const loadConversations = async () => {
    const res = await axios.get("/api/chat/conversations");
    setConversations(res.data);

      if (initialConversationId) {
    const found = res.data.find(
      (c) => c.id === initialConversationId
    );
    if (found) {
      setActiveConversation(found);
    }
  }
  
  };

useEffect(() => {
  chatActiveRef.currentConversationId =
    activeConversation?.id || null;

  return () => {
    chatActiveRef.currentConversationId = null;
  };
}, [activeConversation?.id]);

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

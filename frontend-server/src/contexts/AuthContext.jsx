import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { createSocket, disconnectSocket } from "../socket";
import { useToast } from "./ToastContext";
import { chatActiveRef } from "../ChatActiveRev";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = "http://localhost:5000";
axios.defaults.baseURL = API_URL;
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
const {show}=useToast();
const navigate=useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    if (token) {
      //axios.defaults.baseURL = API_URL;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }


  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };


  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

   const  socket=createSocket(token);

  const onNotification = (notif) => {
    if (notif.type === "message") {
    if (chatActiveRef.currentConversationId == notif.conversation.id) {
      return;
    }

const preview = notif.text.slice(0, 30);

const groupLabel =
  notif.conversation?.is_group && notif.conversation?.title
    ? ` (group: ${notif.conversation.title})`
    : "";

const message = `@${notif.sender.username}: ${preview}${groupLabel}`;
 
      show(message,
        "info",
        {      onClick: () => {
        navigate("/chat", {
          state: { conversationId: notif.conversation.id },
        });
      }},
      );
    }
  };


socket.on("notification:new", onNotification);



    return () => {
      socket.off("notification:new", onNotification);
      // cleanup on provider unmount or token change
      disconnectSocket();
    };
  }, [token]);












  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

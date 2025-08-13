import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Create global store(context)
const ChatContext = createContext();

// Provider component(main logic)
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat] =useState();
  const [chats,setChats]=useState([]);
   const [notification, setNotification] = useState([]);
  

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo); // sets the user value..

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Custom hook to use context
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

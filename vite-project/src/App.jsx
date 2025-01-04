import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatDisplay from "./components/ChatDisplay";
import LoginPage from "./components/LoginPage";
import NewAccount from "./components/NewAccount";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function getMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

/*
  return (
    //<LoginPage/>
    <NewAccount/>
  )
  */
  return (
    <div>
    <h1 className="text-3xl font-bold text-center mt-8">Chat App</h1>
    <ChatDisplay allMessages={messages} loading={loading} />
    <ChatInput getMessage={getMessage} setLoading={setLoading} />
    </div>
  );
  
}

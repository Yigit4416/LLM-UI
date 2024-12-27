import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatDisplay from "./components/ChatDisplay";

export default function App() {
  const [messages, setMessages] = useState([]);

  function getMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8">Chat App</h1>
      <ChatDisplay allMessages={messages} />
      <ChatInput getMessage={getMessage} />
    </div>
  );
}

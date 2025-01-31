import { useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatDisplay from "./components/ChatDisplay";
import LoginPage from "./components/LoginPage";
import NewAccount from "./components/NewAccount";
import SideMenu from "./components/SideMenu";
import { BrowserRouter, Routes, Route, /*Link, Outlet*/ } from 'react-router-dom';

export default function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-account" element={<NewAccount />} />
          <Route path="/side-menu" element={<SideMenu />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
      
  
}

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  function getMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
  return(
  <div>
    <h1 className="text-3xl font-bold text-center mt-8">Chat App</h1>
    <ChatDisplay allMessages={messages} loading={loading} />
    <ChatInput getMessage={getMessage} setLoading={setLoading} />
  </div>
  )
};
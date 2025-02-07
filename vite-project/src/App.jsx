import { useState, useEffect } from "react";
import ChatInput from "./components/ChatInput";
import ChatDisplay from "./components/ChatDisplay";
import LoginPage from "./components/LoginPage";
import NewAccount from "./components/NewAccount";
import SideMenu from "./components/SideMenu";
import { BrowserRouter, Routes, Route, useNavigate /*Link, Outlet*/ } from 'react-router-dom';
import axios from "axios";

export default function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chat" element={<MainPage />} />
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
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/is-logged-in", { withCredentials: true })
      .then((response) => {
        response.data === "true" ? console.log("User is logged in") :
        navigate("/chat");
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  }, []);
  function getMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  return (
    <div className="flex">
      <SideMenu />
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mt-8">Chat App</h1>
        <ChatDisplay allMessages={messages} loading={loading} />
        <ChatInput getMessage={getMessage} setLoading={setLoading} />
      </div>
    </div>
  );
};
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lookingOldChat, setLookingOldChat] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatIndex, setChatIndex] = useState();
  const [sendMessages, setSendMessages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/is-logged-in", { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn === true) {
          console.log("User is logged in");
        }
        else {
          console.log("User is not logged in");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  });

  useEffect(() => {
    if (messages.length > 0 && !lookingOldChat) {
      axios.post("http://localhost:8080/savemessage", 
        {
          chatIndex: chatIndex,
          messageContent: messages[messages.length - 1].message,
          mode: messages[messages.length - 1].sender === "User" ? "send" : "receive"
        }, 
        { withCredentials: true }
      )
      .then(response => {
        console.log("Message saved successfully", response.data);
      })
      .catch(error => {
        console.error("Error saving message", error);
      });      
    }
    }, [messages, chatIndex, sendMessages, lookingOldChat]);

  function getMessage(message) {
    if(message === null) {
      setMessages([]);
    }
    else {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message);
    }
  }

  return (
    <div className="flex">
      <SideMenu
        isInitialLoad={isInitialLoad}
        setIsInitialLoad={setIsInitialLoad}
        lookingOldChat={lookingOldChat}
        setLookingOldChat={setLookingOldChat}
        messageList={messageList}
        setMessageList={setMessageList}
        getMessage={getMessage}
        setChatIndex={setChatIndex}
        />
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mt-8">Chat App</h1>
        <ChatDisplay 
          allMessages={messages}
          loading={loading}
          />
        <ChatInput
          isInitialLoad={isInitialLoad}
          setIsInitialLoad={setIsInitialLoad}
          messageList={messageList}
          setChatIndex={setChatIndex}
          chatIndex={chatIndex}
          getMessage={getMessage}
          setLoading={setLoading}
          allMessages={messages}
          setSendMessages={setSendMessages}
        />
      </div>
    </div>
  );
};
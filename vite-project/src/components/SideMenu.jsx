// This will include chat history and settings bar.
import { useState, useEffect } from "react";
import axios from "axios";

export default function SideMenu() {
    const [messageList, setMessageList] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    //const [newChatCreated, setNewChatCreated] = useState(false);

    useEffect(() => {
        if (isInitialLoad) {
            axios.get("http://localhost:8080/chat-history", { withCredentials: true })
                .then((response) => {
                    setMessageList(response.data);
                    setIsInitialLoad(false);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [isInitialLoad]);

    return(
        <div className="w-1/4 h-full bg-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl p-2">Chat History</h2>
                <button className="p-2 bg-blue-500 text-white">Settings</button>
            </div>
            <div className="p-2">
                <ul>
                    {messageList.map((message, index) => {
                        return (
                            <li key={index} className="border-b-2 border-gray-400 p-2">{message.header}</li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
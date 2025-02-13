import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

export default function SideMenu({ getMessage, setChatIndex, messageList, setMessageList, setLookingOldChat, setIsInitialLoad, isInitialLoad }) {
    const [menuCollapse, setMenuCollapse] = useState(false);

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
    }, [isInitialLoad, setMessageList]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const xPercent = (event.clientX / window.innerWidth) * 100;
            if (xPercent < 4) {
                setMenuCollapse(false);
            } else if (xPercent > 30) {
                setMenuCollapse(true);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    function newWindow(index) {
        setLookingOldChat(true);
        const chatID = messageList[index].chatID;
        setChatIndex(chatID);
        axios.get(`http://localhost:8080/chat-history/${chatID}`, { withCredentials: true })
            .then((response) => {
                getMessage(null);
                console.log(response.data);
                response.data.forEach(element => {
                    getMessage({
                        sender: element.is_ai_message ? "Bot" : "User",
                        message: element.message_content
                    });
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    return (
        <div className={`fixed top-0 left-0 w-1/4 h-screen bg-gray-800 text-white shadow-lg flex flex-col z-50 transition-transform duration-300 ${
            menuCollapse ? '-translate-x-full' : 'translate-x-0'
        }`}>
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-2xl font-semibold">Chat History</h2>
                <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                    Settings
                </button>
            </div>
            {/* Main content with padding bottom to prevent overlap with new chat button */}
            <div className="flex-1 p-4 pb-16 overflow-hidden">
                <ul className="h-full overflow-y-auto space-y-2 scrollbar-dark">
                    {messageList.map((message, index) => (
                        <li
                            key={index}
                            className="border-b border-gray-700 p-2 hover:bg-gray-700 rounded cursor-pointer"
                            onClick={() => newWindow(index)}
                        >
                            {message.header}
                        </li>
                    ))}
                </ul>
            </div>
            {/* New Chat Button */}
            <button 
                onClick={() => {
                    getMessage(null);
                    setChatIndex(undefined);
                    setIsInitialLoad(true);
                }}
                className="absolute bottom-0 left-0 w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold border-t border-gray-700"
            >
                New Chat
            </button>
        </div>
    );
}

SideMenu.propTypes = {
    // Function to handle message updates
    getMessage: PropTypes.func.isRequired,
    // Function to update chat index
    setChatIndex: PropTypes.func.isRequired,
    setLookingOldChat: PropTypes.func.isRequired,
    setIsInitialLoad: PropTypes.func.isRequired,
    isInitialLoad: PropTypes.bool.isRequired,
    // Array of message objects
    messageList: PropTypes.arrayOf(
        PropTypes.shape({
            chatID: PropTypes.number.isRequired,
            header: PropTypes.string.isRequired
        })
    ).isRequired,
    // Function to update message list
    setMessageList: PropTypes.func.isRequired
};
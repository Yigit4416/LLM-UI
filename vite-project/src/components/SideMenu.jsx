import { useState, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
export default function SideMenu({ getMessage }) {
    const [messageList, setMessageList] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
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
    }, [isInitialLoad]);

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

    function newWindow(index/*, event*/) {
        /*
        const clickedElement = event.target;
        
        // Get element properties
        console.log("Clicked element:", clickedElement);
        console.log("Element text content:", clickedElement.textContent);
        console.log("Element class list:", clickedElement.className);
        */
        const chatID = messageList[index].chatID
        axios.get(`http://localhost:8080/chat-history/${chatID}`, { withCredentials: true })
        .then((response) => {
            //const chatList = [];
            getMessage(null)
            response.data.forEach(element => {
                getMessage({
                    sender: element.sender ? "Bot" : "User", 
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
              
            {/* Scrollable Content Area */}
            <div className="flex-1 p-4 overflow-hidden">
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
        </div>
    );
}
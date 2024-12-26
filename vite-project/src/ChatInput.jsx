import { useState } from "react";
import axios from "axios";

export default function ChatInput() {
    
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(event) {
        console.log(message);
        event.preventDefault();
        if (message.trim() !== "") {
            setLoading(true);
            axios.post("http://192.168.1.16:8080/api", {
                prompt: message,
            })
            .then((response) => {
                console.log(response.data);
                setResponse(response.data);
                setMessage("");
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setLoading(false);
            });
        }
    }

    function handleChange(event) {
        setMessage(event.target.value);
    }
    
    return (
        <>
            <h3>{loading ? "writing..." : response}</h3>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type a message..."
                className="border-2 border-gray-300 p-2 w-full rounded-lg"
                />
            <button type="submit" className="border-cyan-500">Submit</button>
            </form>
        </>
    );
}
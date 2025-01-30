import { useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const FormattedText = ({ text }) => (
  <pre className="whitespace-pre-wrap break-words font-sans m-0">
    {text}
  </pre>
);

// eslint-disable-next-line react/prop-types
export default function ChatInput({ getMessage, setLoading }) {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (message.trim() !== "") {
      getMessage({ 
        sender: "User", 
        message: <FormattedText text={message} />
      });
      setMessage("");
      setLoading(true);
      
      axios
        .post("http://localhost:8080/api", {
          prompt: message,
        })
        .then((response) => {
          console.log(response.data);
          getMessage({ 
            sender: "Bot", 
            message: <FormattedText text={response.data} />
          });
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
    <div className="flex flex-col h-min">
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full bg-white p-4 border-t border-gray-300 flex items-center gap-2"
      >
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-grow border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Send
        </button>
      </form>
    </div>
  );
}
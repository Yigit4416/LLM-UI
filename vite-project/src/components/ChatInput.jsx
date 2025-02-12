import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import axios from "axios";

const FormattedText = ({ text }) => (
  <pre className="whitespace-pre-wrap break-words font-sans m-0">
    {text}
  </pre>
);

export default function ChatInput({ getMessage, setLoading, setSendMessages, chatIndex, setChatIndex, messageList }) {
  const [message, setMessage] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if(chatIndex === undefined) {
      setIsEmpty(true);
    }
  }, [chatIndex]);

  function handleSubmit(event) {
    event.preventDefault();
    if (message.trim() !== "") {
      getMessage({ 
        sender: "User", 
        message: <FormattedText text={message} />
      });
      setMessage("");
      setLoading(true);
      
      if(isEmpty) {
        // for message
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
          // for header
          setChatIndex(messageList.length + 1);
          axios.post("http://localhost:8080/newmessage", {
            chatIndex: chatIndex,
            messageContent: message,
          }, { withCredentials: true })
          .then((response) => {
            console.log("Message saved successfully", response.data);
          })
          .catch((error) => {
            console.error("Error saving message", error);
          });
      } else {
        setSendMessages(true);
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

ChatInput.propTypes = {
  getMessage: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  messageList: PropTypes.array.isRequired,
  setSendMessages: PropTypes.func.isRequired,
  chatIndex: PropTypes.number,
  setChatIndex: PropTypes.func.isRequired
};

FormattedText.propTypes = {
  text: PropTypes.string.isRequired
};
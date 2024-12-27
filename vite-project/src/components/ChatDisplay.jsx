/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

export default function ChatDisplay({ allMessages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, loading]);

  return (
    <div className="grid auto-rows-min gap-4 p-4 mb-16 overflow-y-auto">
      {Array.isArray(allMessages) &&
        allMessages.map((message, index) => (
          <div
            key={index}
            className={`p-4 max-w-fit rounded-md ${
              message.sender === "Bot"
                ? "bg-blue-300 text-left self-start"
                : "bg-green-500 text-right self-end ml-auto"
            }`}
          >
            {message.message}
          </div>
        ))}
      {loading && (
        <div className="p-4 max-w-fit rounded-md bg-gray-300 text-left self-start">
          writing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

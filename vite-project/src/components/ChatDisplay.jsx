/* eslint-disable react/prop-types */
export default function ChatDisplay({ allMessages }) {
  return (
    <div className="grid auto-rows-min gap-4 p-4">
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
    </div>
  );
}

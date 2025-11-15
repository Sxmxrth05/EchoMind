// src/components/MessageList.tsx
import React from "react";

// Export the interface so App.tsx can use it
export interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className="rounded-2xl px-5 py-3 max-w-2xl shadow-sm"
              style={{
                backgroundColor:
                  message.sender === "user" ? "#C8E6C9" : "#D1C4E9",
                color: "#37474F",
              }}
            >
              <p className="text-base leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;

// src/components/MessageList.tsx
import React from "react";

// Export the interface so App.tsx can use it
export interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  isLoading?: boolean;
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
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "#37474F",
                        animationDelay: "0ms",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "#37474F",
                        animationDelay: "150ms",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "#37474F",
                        animationDelay: "300ms",
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-base leading-relaxed">{message.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;

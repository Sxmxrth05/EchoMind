// src/components/ChatInput.tsx
import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputText: string;
  setInputText: (value: string) => void;
  handleSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  handleSendMessage,
}) => {
  return (
    <div
      className="border-t px-8 py-4 flex-shrink-0"
      style={{ borderColor: "#E0E0E0" }}
    >
      <div className="max-w-4xl mx-auto flex gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Share your thoughts..."
          className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: "white",
            color: "#37474F",
            borderColor: "#E0E0E0",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#00796B";
            e.currentTarget.style.boxShadow =
              "0 0 0 2px rgba(0, 121, 107, 0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E0E0E0";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          onClick={handleSendMessage}
          className="px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
          style={{ backgroundColor: "#00796B" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#00695C")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#00796B")
          }
        >
          <Send size={20} />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

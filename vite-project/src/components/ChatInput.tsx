// src/components/ChatInput.tsx
import { useState } from "react";
import { Send, Settings } from "lucide-react";

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
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  return (
    <div
      className="border-t px-8 py-4 flex-shrink-0"
      style={{ borderColor: "#E0E0E0" }}
    >
      <div className="max-w-4xl mx-auto flex gap-3">
        {/* Tools dropdown button positioned left of input */}
        <div className="relative">
          <button
            onClick={() => setShowToolsDropdown(!showToolsDropdown)}
            className="px-4 py-3 rounded-lg border font-medium transition-colors flex items-center gap-2"
            style={{
              backgroundColor: "#00796B",
              color: "white",
              borderColor: "#00796B",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00695C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#00796B";
            }}
          >
            <Settings size={16} />
            Tools
          </button>

          {/* Dropdown menu */}
          {showToolsDropdown && (
            <div
              className="absolute bottom-full mb-2 left-0 w-48 bg-white border rounded-lg shadow-lg z-10"
              style={{ borderColor: "#E0E0E0" }}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    console.log("Export to PDF clicked");
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 transition-colors"
                  style={{ color: "#00796B" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  📄 Export to PDF
                </button>
                <button
                  onClick={() => {
                    console.log("Emotional Map clicked");
                    setShowToolsDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 transition-colors"
                  style={{ color: "#00796B" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f9ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  🧠 Emotional Map
                </button>
              </div>
            </div>
          )}
        </div>
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

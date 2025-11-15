// src/components/ChatInput.tsx
import { useState, useEffect, useRef } from "react";
import { Send, Settings, Mic, MicOff } from "lucide-react";

// Speech Recognition Types
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence?: number;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => any) | null;
  onend: (() => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface ChatInputProps {
  inputText: string;
  setInputText: (value: string) => void;
  handleSendMessage: () => void;
  onShowEmotionMap?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  handleSendMessage,
  onShowEmotionMap,
}) => {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInputText(transcript);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isListening, setInputText]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div
      className="border-t px-8 py-4 flex-shrink-0"
      style={{ borderColor: "#E0E0E0" }}
    >
      <div className="max-w-4xl mx-auto flex gap-3">
        {/* Microphone button for speech-to-text */}
        <button
          onClick={toggleListening}
          className={`px-4 py-3 rounded-lg border font-medium transition-colors flex items-center justify-center ${
            isListening ? "animate-pulse" : ""
          }`}
          style={{
            backgroundColor: isListening ? "#FF5722" : "#00796B",
            color: "white",
            borderColor: isListening ? "#FF5722" : "#00796B",
            minWidth: "52px",
          }}
          onMouseEnter={(e) => {
            if (!isListening) {
              e.currentTarget.style.backgroundColor = "#00695C";
            }
          }}
          onMouseLeave={(e) => {
            if (!isListening) {
              e.currentTarget.style.backgroundColor = "#00796B";
            }
          }}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

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
            <Settings size={20} />
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
                    onShowEmotionMap?.();
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

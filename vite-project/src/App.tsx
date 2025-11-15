import { useState } from "react";
import Sidebar, { type JournalItem } from "./components/sideBar";
// import ChatHeader from "./components/ChatHeader";
import MessageList, { type Message } from "./components/MessageList";
import ChatInput from "./components/ChatInput";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");

  // --- Message and History state remains here ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm feeling a bit overwhelmed...", sender: "user" },
    {
      id: 2,
      text: "I understand that work can feel overwhelming...",
      sender: "ai",
    },
    // ...other messages
  ]);

  const dummyHistory: JournalItem[] = [
    { id: 1, title: "Morning Reflections" },
    { id: 2, title: "Weekend Adventures" },
    // ...other history items
  ];

  // --- Logic remains in the parent ---
  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputText,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: "Thank you for sharing that...",
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen((prev) => !prev)}
        history={dummyHistory}
        activeId={1}
      />

      {/* Main chat area is now composed of smaller components */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Component 1: Header */}
        {/* <ChatHeader /> */}

        {/* Component 2: Message List */}
        <MessageList messages={messages} />

        {/* Component 3: Input Area */}
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

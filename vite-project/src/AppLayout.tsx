// src/AppLayout.tsx
import { useState } from "react";
import Sidebar, { type JournalItem } from "./components/sideBar";
import ChatHeader from "./components/ChatHeader";
import MessageList, { type Message } from "./components/MessageList";
import ChatInput from "./components/ChatInput";

// Note: The function is renamed to AppLayout
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm feeling a bit overwhelmed...", sender: "user" },
    {
      id: 2,
      text: "I understand that work can feel overwhelming...",
      sender: "ai",
    },
  ]);

  const dummyHistory: JournalItem[] = [
    { id: 1, title: "Morning Reflections" },
    { id: 2, title: "Weekend Adventures" },
  ];

  const handleSendMessage = () => {
    // ... (your existing send message logic)
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
        history={dummyHistory}
        activeId={1}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessageList messages={messages} />
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

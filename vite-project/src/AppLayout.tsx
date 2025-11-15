// src/AppLayout.tsx
import { useState, useEffect } from "react";
import Sidebar, { type JournalItem } from "./components/sideBar";
import ChatHeader from "./components/ChatHeader";
import MessageList, { type Message } from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { journalStorage } from "./utils/journalStorage";

// Note: The function is renamed to AppLayout
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");
  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize journals and messages from localStorage
  useEffect(() => {
    const storedJournals = journalStorage.getJournals();
    setJournals(storedJournals);

    const activeId = journalStorage.getActiveJournal();
    setActiveJournalId(activeId);

    const storedMessages = journalStorage.getMessages(activeId);
    setMessages(storedMessages);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      journalStorage.saveMessages(activeJournalId, messages);
    }
  }, [messages, activeJournalId]);

  // Handle switching between journals
  const handleJournalSwitch = (journalId: number) => {
    // Save current messages before switching
    journalStorage.saveMessages(activeJournalId, messages);

    // Load new journal messages
    const newMessages = journalStorage.getMessages(journalId);
    setMessages(newMessages);
    setActiveJournalId(journalId);
    journalStorage.setActiveJournal(journalId);
    setInputText(""); // Clear input when switching journals
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessageText = inputText;

      // Add user message immediately
      const newMessage: Message = {
        id: messages.length + 1,
        text: userMessageText,
        sender: "user",
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      try {
        // Send to backend API
        const response = await fetch("/echo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: {
              query: userMessageText,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Add AI response
          const aiResponse: Message = {
            id: messages.length + 2,
            text: data.response || "I'm here to listen and support you.",
            sender: "ai",
          };
          setMessages((prev) => [...prev, aiResponse]);
        } else {
          throw new Error("Failed to get response from server");
        }
      } catch (error) {
        console.error("Error calling backend API:", error);

        // Fallback response if API fails
        const fallbackResponse: Message = {
          id: messages.length + 2,
          text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
          sender: "ai",
        };
        setMessages((prev) => [...prev, fallbackResponse]);
      }
    }
  };

  const activeJournal = journals.find((j) => j.id === activeJournalId);

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
        history={journals}
        activeId={activeJournalId}
        onJournalSelect={handleJournalSwitch}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader title={activeJournal?.title || "Journal Chat"} />
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

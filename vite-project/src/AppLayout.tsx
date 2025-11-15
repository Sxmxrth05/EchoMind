// src/AppLayout.tsx
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Sidebar, { type JournalItem } from "./components/sideBar";
import ChatHeader from "./components/ChatHeader";
import MessageList, { type Message } from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import EmotionMap from "./components/EmotionMap";
import { journalStorage } from "./utils/journalStorage";

// Backend API URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Note: The function is renamed to AppLayout
export default function AppLayout() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>("");
  const [journals, setJournals] = useState<JournalItem[]>([]);
  const [activeJournalId, setActiveJournalId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmotionMap, setShowEmotionMap] = useState<boolean>(false);

  // Get user info from Clerk
  const username = user?.username || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '') ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 
    'User';
  const email = user?.primaryEmailAddress?.emailAddress || 'user@example.com';

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

  // Handle creating a new journal
  const handleNewJournal = () => {
    // Save current messages before creating new journal
    journalStorage.saveMessages(activeJournalId, messages);

    // Create new journal with unique ID
    const newId = Math.max(...journals.map((j) => j.id), 0) + 1;
    const newJournal: JournalItem = {
      id: newId,
      title: `Journal ${new Date().toLocaleDateString()}`,
    };

    // Add to journals list
    const updatedJournals = [...journals, newJournal];
    setJournals(updatedJournals);
    journalStorage.saveJournals(updatedJournals);

    // Switch to the new journal (empty messages)
    setMessages([]);
    setActiveJournalId(newId);
    journalStorage.setActiveJournal(newId);
    setInputText("");
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

      // Add loading indicator
      const loadingMessage: Message = {
        id: messages.length + 2,
        text: "",
        sender: "ai",
        isLoading: true,
      };

      setMessages([...messages, newMessage, loadingMessage]);
      setInputText("");

      try {
        // Send to backend API
        const response = await fetch(`${BACKEND_URL}/echo`, {
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

          console.log("Backend response:", data);

          // Extract text from response structure
          let aiText = "I'm here to listen and support you.";

          // Try to extract from different possible response structures
          if (data.echo && typeof data.echo === "string") {
            // Echo response structure (your backend format)
            aiText = data.echo.echo;
          } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            // Gemini API response structure
            aiText = data.candidates[0].content.parts[0].text;
          } else if (data.response && typeof data.response === "string") {
            // Simple response structure
            aiText = data.response;
          } else if (data.text && typeof data.text === "string") {
            // Alternative text field
            aiText = data.text;
          } else if (typeof data === "string") {
            // Plain string response
            aiText = data;
          } else {
            // If we still have an object, try to stringify it for debugging
            // console.error("Unexpected response format:", data);
            // aiText = "I received a response but couldn't parse it correctly.";
            aiText = data.echo.echo;
          }

          console.log("Extracted AI text:", aiText);

          // Replace loading message with AI response
          setMessages((prev) => {
            const withoutLoading = prev.filter((msg) => !msg.isLoading);
            return [
              ...withoutLoading,
              {
                id: messages.length + 2,
                text: aiText,
                sender: "ai" as const,
              },
            ];
          });
        } else {
          throw new Error("Failed to get response from server");
        }
      } catch (error) {
        console.error("Error calling backend API:", error);

        // Replace loading message with fallback response
        setMessages((prev) => {
          const withoutLoading = prev.filter((msg) => !msg.isLoading);
          return [
            ...withoutLoading,
            {
              id: messages.length + 2,
              text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
              sender: "ai" as const,
            },
          ];
        });
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
        onNewJournal={handleNewJournal}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader 
          title={activeJournal?.title || "Journal Chat"} 
          username={username}
          email={email}
        />
        
        {showEmotionMap ? (
          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center" style={{ backgroundColor: "#F8F9FA" }}>
            <div className="w-full max-w-4xl">
              <button
                onClick={() => setShowEmotionMap(false)}
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                ← Back to Chat
              </button>
              <EmotionMap userId={user?.id} />
            </div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={handleSendMessage}
              onShowEmotionMap={() => setShowEmotionMap(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}

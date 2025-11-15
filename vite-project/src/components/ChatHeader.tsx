// src/components/ChatHeader.tsx
import { User } from "lucide-react";
import { useState } from "react";
// import { UserButton } from "@clerk/clerk-react";

interface ChatHeaderProps {
  title?: string;
  username?: string;
  email?: string;
}

function ChatHeader({ title = "Journal Chat", username = "John Doe", email = "john.doe@example.com" }: ChatHeaderProps) {
  const [showUserInfo, setShowUserInfo] = useState(false);

  return (
    <div
      className="h-16 flex items-center justify-between px-8 border-b flex-shrink-0"
      style={{ borderColor: "#E0E0E0" }}
    >
      <h1 className="text-2xl font-bold" style={{ color: "#37474F" }}>
        {title}
      </h1>

      {/* TEMP: Auth disabled for development */}
      <div className="flex items-center space-x-3">
        <div 
          className="relative"
          onMouseEnter={() => setShowUserInfo(true)}
          onMouseLeave={() => setShowUserInfo(false)}
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors">
            <User size={20} />
          </div>
          
          {/* User Info Tooltip */}
          {showUserInfo && (
            <div 
              className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-3 z-10"
              style={{ 
                borderColor: "#E0E0E0",
                minWidth: "200px"
              }}
            >
              <p className="text-sm font-semibold text-gray-800">{username}</p>
              <p className="text-xs text-gray-600 mt-1">{email}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition-colors duration-200 text-sm"
        >
          Log Out
        </button>
      </div>

      {/* Real auth button (commented out for development)
      <UserButton afterSignOutUrl="/" />
      */}
    </div>
  );
}

export default ChatHeader;

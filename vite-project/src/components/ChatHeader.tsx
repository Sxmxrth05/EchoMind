// src/components/ChatHeader.tsx
// import { UserButton } from "@clerk/clerk-react";

interface ChatHeaderProps {
  title?: string;
}

function ChatHeader({ title = "Journal Chat" }: ChatHeaderProps) {
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
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          JD
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

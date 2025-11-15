// src/components/ChatHeader.tsx
import React from "react";
import { UserButton } from "@clerk/clerk-react";

function ChatHeader() {
  return (
    <div
      className="h-16 flex items-center justify-between px-8 border-b flex-shrink-0"
      style={{ borderColor: "#E0E0E0" }}
    >
      <h1 className="text-2xl font-bold" style={{ color: "#37474F" }}>
        Journal Chat
      </h1>

      {/* This is the magic logout/profile button from Clerk */}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default ChatHeader;

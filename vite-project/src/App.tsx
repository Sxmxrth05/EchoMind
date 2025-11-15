// src/App.tsx
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import AppLayout from "./AppLayout";

function App() {
  return (
    <>
      <SignedIn>
        <AppLayout />
      </SignedIn>
      <SignedOut>
        <div
          className="flex flex-col items-center justify-center h-screen"
          style={{ backgroundColor: "#E0F2F7" }}
        >
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#00796B" }}>
            Welcome to EchoMind
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your reflective journal for emotional regulation.
          </p>

          <SignInButton mode="modal">
            <button
              className="px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              style={{ backgroundColor: "#00796B" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#00695C")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#00796B")
              }
            >
              Sign In or Sign Up
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}

export default App;

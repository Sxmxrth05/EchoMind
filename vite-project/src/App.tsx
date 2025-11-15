// src/App.tsx
import { Routes, Route } from "react-router-dom";
// import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./AppLayout";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/" element={<LandingPage />} />

      {/* TEMP: Auth disabled for development */}
      <Route path="/app" element={<AppLayout />} />
      
      {/* PRIVATE ROUTE (commented out for development)
      <Route
        path="/app"
        element={
          <>
            <SignedIn>
              <AppLayout />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn redirectUrl="/" />
            </SignedOut>
          </>
        }
      />
      */}
    </Routes>
  );
}

export default App;

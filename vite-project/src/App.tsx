// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./AppLayout"; // Your protected app

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE: 
        Everyone can see this.
      */}
      <Route path="/" element={<LandingPage />} />

      {/* PRIVATE ROUTE: 
        - If you are logged in, you'll see <AppLayout />
        - If you are logged out, you'll be redirected to the sign-in page.
      */}
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
    </Routes>
  );
}

export default App;

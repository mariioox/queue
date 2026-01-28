import "./index.css";
import App from "./App.tsx";
import { QueueProvider } from "./context/QueueProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Define your custom text here
const localization = {
  signIn: {
    start: {
      title: "Login",
      subtitle: "Welcome back! Enter your details below.",
      actionText: "Don't have an account?",
      actionLink: "SignUp",
    },
  },
  signUp: {
    start: {
      title: "Create Account",
      subtitle: "Join Q-LINE to start skipping the wait.",
      actionText: "Already have an account?",
      actionLink: "Login",
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={localization}>
      <QueueProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueueProvider>
    </ClerkProvider>
  </React.StrictMode>,
);

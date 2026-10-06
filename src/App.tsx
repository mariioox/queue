import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import MyQueue from "./pages/MyQueue";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import ShopDetail from "./pages/ShopDetails";
import UserProfilePage from "./pages/UserProfile";
import { Routes, Route } from "react-router-dom";
import { AdminDash } from "./pages/AdminDashboard";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/shop/:id" element={<ShopDetail />} />

          {/* Clerk Auth Routes (Using Clerk's built-in UI) */}
          <Route path="/login/*" element={<Login />} />
          <Route path="/signup/*" element={<SignUp />} />

          {/* Protected Routes (Only for logged-in users) */}
          <Route
            path="/my-queue"
            element={
              <>
                <SignedIn>
                  <MyQueue />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                  <AdminDash />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route
            path="/profile/*"
            element={
              <>
                <SignedIn>
                  <UserProfilePage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "bg-card border-2 border-ink text-ink rounded-lg shadow-[4px_4px_0_0_var(--ink)] px-4 py-3 flex items-center gap-3 font-medium text-sm w-full",
            title: "font-bold text-ink",
            description: "text-ink-muted text-xs font-medium mt-0.5",
            actionButton:
              "bg-accent text-on-accent font-mono text-[10px] uppercase tracking-[0.14em] font-bold px-3 py-1.5 rounded shrink-0",
            cancelButton: "text-ink-muted text-xs font-bold shrink-0",
            closeButton: "text-ink-muted ml-auto shrink-0",
          },
        }}
      />
    </>
  );
}

export default App;

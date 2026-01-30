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
// ... import other pages

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/shop/:shopId" element={<ShopDetail />} />

        {/* Clerk Auth Routes (Using Clerk's built-in UI) */}
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<SignUp />} />

        {/* Protected Routes (Only for logged-in users) */}
        <Route
          path="/my-queue"
          element={
            <>
              <SignedIn>
                {" "}
                <MyQueue />{" "}
              </SignedIn>
              <SignedOut>
                {" "}
                <RedirectToSignIn />{" "}
              </SignedOut>
            </>
          }
        />

        <Route
          path="/admin"
          element={
            <>
              <SignedIn>
                {" "}
                <AdminDash />{" "}
              </SignedIn>
              <SignedOut>
                {" "}
                <RedirectToSignIn />{" "}
              </SignedOut>
            </>
          }
        />

        {/* New Profile Route */}
        <Route
          path="/profile/*"
          element={
            <>
              <SignedIn>
                {" "}
                <UserProfilePage />{" "}
              </SignedIn>
              <SignedOut>
                {" "}
                <RedirectToSignIn />{" "}
              </SignedOut>
            </>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

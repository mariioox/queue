import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ShopDetail from "./pages/ShopDetails";
import MyQueue from "./pages/MyQueue";
import { AdminDash } from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
// ... import other pages

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/my-queue" element={<MyQueue />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Dynamic Route: :shopId will change based on the shop clicked */}
        <Route path="/shop/:shopId" element={<ShopDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

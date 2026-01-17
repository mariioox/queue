import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-3 text-center">
      <h1 className="text-5xl font-black text-gray-800 mb-5">404</h1>
      <p className="text-2xl font-bold mb-1">Lost in line?</p>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-black text-white px-6 py-3 rounded-lg font-bold"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;

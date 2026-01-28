import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">
          Q-LINE
        </h1>
        <p className="text-gray-500 font-medium">Join the future of queuing</p>
      </div>

      <div className="pl-5 w-full max-w-md">
        {/* Clerk component properly edited to match our UI */}
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          appearance={{
            elements: {
              card: {
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                borderRadius: "2.5rem",
                border: "1px solid #f3f4f6",
                padding: "2rem",
                width: "100%",
              },
              formButtonPrimary: {
                backgroundColor: "#2563eb",
                fontSize: "0.875rem",
                borderRadius: "1rem",
                height: "3.5rem",
                fontWeight: "700",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              },
              formFieldInput: {
                backgroundColor: "#f9fafb",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                height: "3rem",
              },
              footer: {
                display: "none",
              },
              headerTitle: {
                fontSize: "1.25rem",
                fontWeight: "700",
              },
            },
          }}
        />

        {/* Custom Footer Link */}
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-black hover:underline transition-all"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900">
          Q-LINE
        </h1>
        <p className="text-gray-500 font-medium">Manage your spots with ease</p>
      </div>

      <div className="pl-5 w-full max-w-md">
        {/* Clerk component properly edited to match our UI */}
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          forceRedirectUrl="/explore"
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
                height: "4rem",
              },
              footer: {
                display: "none", // We'll use our custom link below for better control
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
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-black hover:underline transition-all"
          >
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

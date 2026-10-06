import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { clerkAppearance } from "../lib/clerkAppearance";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4 py-12">
      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent font-bold mb-2">
          Welcome back
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          Q-LINE
        </h1>
        <p className="text-ink-muted font-medium mt-1">
          Manage your spots with ease
        </p>
      </div>

      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          forceRedirectUrl="/explore"
          appearance={clerkAppearance}
        />

        {/* Custom Footer Link */}
        <p className="mt-8 text-center text-sm text-ink-muted font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-accent font-bold hover:underline transition-all"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

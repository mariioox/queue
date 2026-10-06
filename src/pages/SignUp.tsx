import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { clerkAppearance } from "../lib/clerkAppearance";

const Signup = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-canvas px-4 py-12">
      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent font-bold mb-2">
          Join the line
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          Q-LINE
        </h1>
        <p className="text-ink-muted font-medium mt-1">
          Never stand in a queue again
        </p>
      </div>

      <div className="w-full max-w-md">
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          appearance={clerkAppearance}
        />

        {/* Custom Footer Link */}
        <p className="mt-8 text-center text-sm text-ink-muted font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent font-bold hover:underline transition-all"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

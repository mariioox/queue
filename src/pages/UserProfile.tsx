import { UserProfile as ClerkProfile } from "@clerk/clerk-react";
import { clerkAppearance } from "../lib/clerkAppearance";

const UserProfilePage = () => {
  return (
    <div className="flex justify-center p-8 bg-canvas min-h-screen">
      <div className="w-full max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent font-bold mb-2">
          Account
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">
          My account
        </h1>
        <ClerkProfile routing="path" path="/profile" appearance={clerkAppearance} />
      </div>
    </div>
  );
};

export default UserProfilePage;

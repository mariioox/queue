import { UserProfile as ClerkProfile } from "@clerk/clerk-react";

const UserProfilePage = () => {
  return (
    <div className="flex justify-center p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-black mb-8">My Account</h1>
        <ClerkProfile routing="path" path="/profile" />
      </div>
    </div>
  );
};

export default UserProfilePage;

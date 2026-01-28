import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import BusinessOnboarding from "../components/BusinessOnboarding";
import RealAdminDashboard from "../components/RealAdminDashboard";

export const AdminDash = () => {
  const { user, isLoaded } = useUser();
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      // I will replace this with a real fetch to the backend
      // Check if there is a shop where ownerId === user.id
      const checkBusiness = async () => {
        // Mock check for now
        const businessExists = false;
        setHasBusiness(businessExists);
      };
      checkBusiness();
    }
  }, [isLoaded, user]);

  if (!isLoaded || hasBusiness === null) return <div>Loading...</div>;

  return (
    <div className="p-6">
      {hasBusiness ? (
        <RealAdminDashboard />
      ) : (
        <BusinessOnboarding onComplete={() => setHasBusiness(true)} />
      )}
    </div>
  );
};

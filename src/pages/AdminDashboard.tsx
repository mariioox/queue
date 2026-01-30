import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import BusinessOnboarding from "../components/BusinessOnboarding";
import RealAdminDashboard from "../components/RealAdminDashboard";

interface Shop {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  image_url: string;
  owner_id: string;
}

export const AdminDash = () => {
  const { user, isLoaded } = useUser();
  const [shop, setShop] = useState<Shop | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const initializeAdmin = async () => {
      if (!isLoaded || !user) return;

      // A. Sync the Profile first (The Handshake)
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.fullName,
        avatar_url: user.imageUrl,
      });

      // B. Check if they already have a shop
      const { data } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (data) setShop(data);
      setChecking(false);
    };

    initializeAdmin();
  }, [user, isLoaded]);

  // This prevents the blank screen and handles your logic
  if (!isLoaded || checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      {shop ? (
        // Pass the shop data as a prop
        <RealAdminDashboard shop={shop} />
      ) : (
        // On success, we just reload to trigger the fetch
        <BusinessOnboarding onComplete={() => window.location.reload()} />
      )}
    </div>
  );
};

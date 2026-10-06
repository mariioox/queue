import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSessionReady } from "../lib/session-context";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import BusinessOnboarding from "../components/BusinessOnboarding";
import ShopAdminDashboard from "../components/ShopAdminDashboard";
import { Button, EmptyState, QueueLoader } from "../components/ui";
import type { Shop } from "../types/queue";

export const AdminDash = () => {
  const { user, isLoaded } = useUser();
  const ready = useSessionReady();
  const [shop, setShop] = useState<Shop | null>(null);
  const [checking, setChecking] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const initializeAdmin = useCallback(async () => {
    if (!isLoaded || !ready) return;
    if (!user) {
      setChecking(false);
      return;
    }

    setChecking(true);
    setLoadError(null);

    try {
      // Sync the profile first with Clerk
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.fullName,
        avatar_url: user.imageUrl,
      });
      if (profileError) {
        // Non-fatal: profile sync failing shouldn't block the dashboard
        toast.warning("Couldn't sync your profile", {
          description: profileError.message,
        });
      }

      // Check if profile already has a shop.
      // maybeSingle: 0 rows is expected for new users, not an error.
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setShop(data ?? null);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Could not load your business.",
      );
    } finally {
      setChecking(false);
    }
  }, [isLoaded, ready, user]);

  useEffect(() => {
    initializeAdmin();
  }, [initializeAdmin, reloadKey]);

  // To prevents the blank screen and handles your loading
  if (!isLoaded || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <QueueLoader label="Setting up your hub…" />
      </div>
    );
  }

  if (loadError)
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <EmptyState
          icon={<AlertTriangle size={36} />}
          title="Couldn't load your business"
          description={loadError}
          action={
            <Button onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="p-6 min-h-screen">
      {shop ? (
        // Pass the shop data as a prop
        <ShopAdminDashboard shop={shop} />
      ) : (
        // On success, reloading the page to trigger the fetch
        <BusinessOnboarding onComplete={() => window.location.reload()} />
      )}
    </div>
  );
};

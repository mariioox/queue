import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setSupabaseAccessToken } from "../lib/supabaseClient";
import { SessionReadyContext } from "../lib/session-context";

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setSupabaseAccessToken(null);
      return;
    }

    setSupabaseAccessToken(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });

    let alive = true;
    getToken()
      .catch(() => undefined)
      .then(() => {
        if (alive) setTokenFetched(true);
      });

    return () => {
      alive = false;
    };
  }, [isLoaded, isSignedIn, getToken]);

  const ready = isLoaded && (!isSignedIn || tokenFetched);

  return (
    <SessionReadyContext.Provider value={ready}>
      {children}
    </SessionReadyContext.Provider>
  );
};

export default SessionProvider;

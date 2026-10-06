import { createContext, useContext } from "react";

/**
 * True once Clerk has loaded and, for signed-in users, the first session
 * token fetch has succeeded — i.e. Supabase requests are authenticated.
 */
export const SessionReadyContext = createContext(false);

export function useSessionReady(): boolean {
  return useContext(SessionReadyContext);
}

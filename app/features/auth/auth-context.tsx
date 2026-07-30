import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { coaches } from "~/lib/sample-data";
import { getSupabaseClient } from "~/lib/supabase/client";
import type { Coach } from "~/types/domain";

interface AuthContextValue {
  user: Coach | undefined;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const sessionKey = "yellow-jackets-dev-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Coach | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(sessionKey);
    if (saved) {
      setUser(coaches.find((coach) => coach.email === saved));
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        const matchedCoach = coaches.find((coach) => coach.email.toLowerCase() === email.toLowerCase());
        const supabase = matchedCoach ? undefined : getSupabaseClient();
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw new Error("Unable to sign in with those credentials.");
        }

        const nextCoach = matchedCoach ?? coaches[0];
        window.localStorage.setItem(sessionKey, nextCoach.email);
        setUser(nextCoach);
      },
      async signOut() {
        await getSupabaseClient()?.auth.signOut();
        window.localStorage.removeItem(sessionKey);
        setUser(undefined);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return value;
}

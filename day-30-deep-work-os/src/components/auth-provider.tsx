/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import {
  createSupabaseBrowser,
} from "@/lib/supabase/browser";

import { syncAll } from "@/lib/sync/sync";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext =
  createContext<AuthContextValue>({
    user: null,
    session: null,
    loading: true,
  });

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const supabase =
      createSupabaseBrowser();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);

        if (data.session) {
          void syncAll();
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_, nextSession) => {
        setSession(nextSession);

        if (nextSession) {
          void syncAll();
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const sync = () => void syncAll();

    window.addEventListener("online", sync);

    return () =>
      window.removeEventListener(
        "online",
        sync,
      );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
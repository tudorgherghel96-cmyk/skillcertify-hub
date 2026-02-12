import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SuperUserContextValue {
  isSuperUser: boolean;
  isAdmin: boolean;
  toggleSuperUser: () => void;
  setSuperUser: (value: boolean) => void;
}

const SuperUserContext = createContext<SuperUserContextValue | undefined>(undefined);

export const SuperUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync super_user and admin role from the database on auth change
  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsSuperUser(false);
        setIsAdmin(false);
        return;
      }

      // Fetch super_user from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("super_user")
        .eq("id", user.id)
        .single();

      // Fetch admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const hasAdmin = roles?.some((r) => r.role === "admin") ?? false;
      setIsAdmin(hasAdmin);
      setIsSuperUser(profile?.super_user === true);
    };

    fetchStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchStatus();
    });

    return () => subscription.unsubscribe();
  }, []);

  const setSuperUser = useCallback(async (value: boolean) => {
    setIsSuperUser(value);
    // Also persist to DB
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ super_user: value }).eq("id", user.id);
    }
  }, []);

  const toggleSuperUser = useCallback(() => {
    setSuperUser(!isSuperUser);
  }, [isSuperUser, setSuperUser]);

  return (
    <SuperUserContext.Provider value={{ isSuperUser, isAdmin, toggleSuperUser, setSuperUser }}>
      {children}
    </SuperUserContext.Provider>
  );
};

export const useSuperUser = () => {
  const ctx = useContext(SuperUserContext);
  if (!ctx) throw new Error("useSuperUser must be used within SuperUserProvider");
  return ctx;
};

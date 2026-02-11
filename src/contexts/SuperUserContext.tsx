import React, { createContext, useContext, useState, useCallback } from "react";

interface SuperUserContextValue {
  isSuperUser: boolean;
  isAdmin: boolean;
  toggleSuperUser: () => void;
  setSuperUser: (value: boolean) => void;
}

const SuperUserContext = createContext<SuperUserContextValue | undefined>(undefined);

const STORAGE_KEY = "sc_super_user";
const ADMIN_KEY = "sc_is_admin";

export const SuperUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSuperUser, setIsSuperUser] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Admin status - stored in localStorage for now, will be replaced with DB lookup when auth is wired
  const [isAdmin] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_KEY) === "true";
    } catch {
      return false;
    }
  });

  const setSuperUser = useCallback((value: boolean) => {
    setIsSuperUser(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {}
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

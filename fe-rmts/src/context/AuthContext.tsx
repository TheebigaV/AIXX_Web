"use client";

import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {User, AuthContextType} from "@/types/auth";
import {
  loginService,
  logoutService,
  getProfileService,
} from "@/services/authService";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get CSRF token + user
  const fetchUser = async () => {
    setLoading(true);
    const response = await getProfileService();
    if (response) {
      setUser(response.user);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    await loginService(email, password);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    router.push("/signin");
  };

  const value = useMemo(
      () => ({user, loading, login, logout,}),
      [user, loading, login, logout,]
  );

  useEffect(() => {
    if (!user) {
      fetchUser();
    } else {

    }
  }, []);


  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

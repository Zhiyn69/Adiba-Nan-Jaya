import React, { createContext, useContext, useState, useEffect } from "react";


type User = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  logoutAll: () => void;
  fetchCsrfToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCsrfToken = async () => {
    try {
      const res = await fetch("/api/auth/csrf-token");
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      return data.csrfToken;
    } catch (e) {
      console.error("Failed to fetch CSRF Token");
      return "";
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await fetchCsrfToken();
      try {
        const csrfToken = await fetchCsrfToken();
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "x-csrf-token": csrfToken
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setToken(data.accessToken);
          
          const meRes = await fetch("/api/auth/me", {
             headers: { Authorization: `Bearer ${data.accessToken}` }
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            setUser(meData.user);
          }
        }
      } catch (err) {
        console.error("No active session");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken }
      });
      setUser(null);
      setToken(null);
    } catch (e) {
      console.error(e);
    }
  };

  const logoutAll = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      await fetch("/api/auth/logout-all", {
        method: "POST",
        headers: { "x-csrf-token": csrfToken }
      });
      setUser(null);
      setToken(null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (user) {
        // 30 minutes = 30 * 60 * 1000 ms = 1800000
        idleTimer = setTimeout(() => {
          logout();
        }, 1800000);
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    if (user) {
      resetIdleTimer();
      events.forEach(e => window.addEventListener(e, resetIdleTimer));
    }

    return () => {
      clearTimeout(idleTimer);
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, logoutAll, fetchCsrfToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

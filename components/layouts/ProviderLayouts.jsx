"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

const THEME_STORAGE_KEY = "notstack.theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export const ThemeContext = /** @type {import('react').Context<{theme:string;toggleTheme:()=>void}>} */ (/** @type {any} */ (require("react").createContext({ theme: "dark", toggleTheme: () => {} })));

const AuthProvider = ({ children, session }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </SessionProvider>
  );
};

export default AuthProvider;

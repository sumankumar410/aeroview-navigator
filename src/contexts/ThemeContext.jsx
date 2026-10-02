import React, { createContext, useContext, useState, useEffect } from "react";








const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return (localStorage.getItem("aerotrack_theme") ) || "dark";
  });

  useEffect(() => {
    localStorage.setItem("aerotrack_theme", theme);
    document.documentElement.classList.toggle("light-mode", theme === "light");
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

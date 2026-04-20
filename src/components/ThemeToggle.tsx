"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'dark'>('dark');

  useEffect(() => {
    // Initial theme detection
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      onClick={toggleTheme} 
      type="button"
      aria-label="Cambiar tema"
      title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      style={{
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.3s ease',
        padding: '8px',
        borderRadius: '50%',
      }}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

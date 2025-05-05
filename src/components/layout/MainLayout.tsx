
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check system preference on initial load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkTheme(true);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Apply theme class to html element
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

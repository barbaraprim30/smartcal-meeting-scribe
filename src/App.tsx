
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Auth Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Availability from "./pages/Availability";
import Meetings from "./pages/Meetings";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Declare window properties to fix TypeScript errors
declare global {
  interface Window {
    handleLogin: () => void;
    handleLogout: () => void;
  }
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated on app load
  useEffect(() => {
    // This would normally check a token in localStorage or a cookie
    const checkAuth = () => {
      const hasAuth = localStorage.getItem('smartcal_auth');
      setIsAuthenticated(!!hasAuth);
    };
    
    checkAuth();
  }, []);
  
  // Mock login function
  const handleLogin = () => {
    localStorage.setItem('smartcal_auth', 'true');
    setIsAuthenticated(true);
  };
  
  // Mock logout function
  const handleLogout = () => {
    localStorage.removeItem('smartcal_auth');
    setIsAuthenticated(false);
  };
  
  // For demo purposes, provide global auth context
  window.handleLogin = handleLogin;
  window.handleLogout = handleLogout;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes - accessible when not authenticated */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes - require authentication */}
            <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/availability" element={<Availability />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Redirect from home to dashboard or login */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

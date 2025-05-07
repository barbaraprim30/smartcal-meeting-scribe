import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, Settings, User, 
  Clock, LogOut, BarChart3, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out",
        });
        
        // Remove auth from localStorage
        localStorage.removeItem('smartcal_auth');
        
        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  // Common nav items for all users
  const commonNavItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/availability', icon: Clock, label: 'Availability' },
    { path: '/meetings', icon: Users, label: 'Meetings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  // Admin-only nav items
  const adminNavItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  // Combine nav items based on user role
  const navItems = isAdmin 
    ? [...commonNavItems, ...adminNavItems]
    : commonNavItems;
  
  return (
    <div className="h-screen w-64 bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-smartcal-700">SmartCal</h1>
        <p className="text-sm text-muted-foreground">Meeting Booking Solution</p>
        {isAdmin && (
          <div className="mt-1 flex items-center gap-1 text-xs text-primary">
            <Shield className="h-3 w-3" />
            <span>Admin Access</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-smartcal-500 text-white hover:bg-smartcal-600"
                    : "text-foreground hover:bg-smartcal-100"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors" onClick={signOut}>
          <LogOut size={18}  />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

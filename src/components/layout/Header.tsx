
import React from 'react';
import { Bell, Moon, Shield, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserRole } from '@/hooks/useUserRole';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkTheme }) => {
  const { isAdmin } = useUserRole();
  
  return (
    <header className="bg-background border-b border-border p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">
            Welcome, {isAdmin ? 'Admin' : 'User'}
            {isAdmin && (
              <span className="inline-flex items-center ml-2 text-sm text-primary">
                <Shield className="h-4 w-4 mr-1" />
                Admin Access
              </span>
            )}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-smartcal-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start">
                <p className="font-medium">New meeting request</p>
                <span className="text-sm text-muted-foreground">From: John Doe</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <p className="font-medium">Calendar sync issue</p>
                <span className="text-sm text-muted-foreground">Google Calendar needs attention</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-smartcal-500">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-8 w-8 rounded-full bg-smartcal-500 text-white flex items-center justify-center">
            {isAdmin ? 'A' : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

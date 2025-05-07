
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'admin' | 'user';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setRole('user');
        setLoading(false);
        return;
      }

      try {
        // Check if user exists in user_roles table with admin role
        // For now, we'll use a simple approach where specific emails are admins
        // In a production app, you would have a proper roles table
        const adminEmails = ['admin@smartcal.com'];
        const isAdmin = adminEmails.includes(session.user.email || '');
        setRole(isAdmin ? 'admin' : 'user');
      } catch (error) {
        console.error("Error checking user role:", error);
        setRole('user'); // Default to user on error
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { role, isAdmin: role === 'admin', loading };
};

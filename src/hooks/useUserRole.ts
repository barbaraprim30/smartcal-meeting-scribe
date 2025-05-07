
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
        const { data: userRole, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows found, which is expected for non-admin users
          console.error("Error checking user role:", error);
          setRole('user');
        } else if (userRole && userRole.role === 'admin') {
          setRole('admin');
        } else {
          // Fallback to the hardcoded admin emails for now
          // In a production app, you would only rely on the database
          const adminEmails = ['admin@smartcal.com'];
          const isAdmin = adminEmails.includes(session.user.email || '');
          setRole(isAdmin ? 'admin' : 'user');
        }
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

  console.log(role === 'admin', "Isadmin");
  return { role, isAdmin: role === 'admin', loading };
};

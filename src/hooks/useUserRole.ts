
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

      // In a real application, this would check the user's role in the database
      // For now, we'll use a hardcoded admin email for demonstration
      const isAdmin = session.user.email === 'admin@example.com';
      setRole(isAdmin ? 'admin' : 'user');
      setLoading(false);
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

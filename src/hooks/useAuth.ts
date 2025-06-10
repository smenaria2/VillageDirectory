import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    retry: false,
  });

  const { data: user } = useQuery({
    queryKey: ["auth-user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
    retry: false,
  });

  return {
    user: user || session?.user,
    isLoading,
    isAuthenticated: !!session,
    session,
  };
}
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UserData } from "@/store/authSlice";
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<UserData> => {
      const { data, error } = await supabase.auth.getUser();
      console.log('=======useGetUser=====', data.user);
      if (!data.user) throw new Error('No user found');
      return {
        ...data.user,
        rentedMovies: data.user.user_metadata?.rentedMovies || [],
        purchasedMovies: data.user.user_metadata?.purchasedMovies || []
      };
    },
  });
};
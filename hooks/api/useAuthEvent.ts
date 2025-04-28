import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useAuth } from "@/store/authSlice";
import { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';

export const useAuthEvent = () => {
    const { setUser, setToken } = useAuth();

  useEffect(() => {
    let authListener: Subscription | null = null;
    
    // Initial session check on app load
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            console.log("AuthEvent: Initial session found on load.");
            setUser(session.user);
            setToken(session.access_token);
            // Optionally redirect if user is already logged in and on auth screen
            // if (router.canGoBack()) router.replace('/(tabs)'); // Be careful with initial routing logic
        } else {
            console.log("AuthEvent: No initial session found on load.");
        }
    });

    // Listen for auth state changes (primarily for SIGNED_OUT from this client)
    const result = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
        console.log("AuthEvent: State changed event:", event, "| Session exists:", !!session);
       
        // Handle SIGNED_OUT event triggered from this app instance
        if (event === 'SIGNED_OUT') {
            console.log("AuthEvent: SIGNED_OUT detected, clearing user and redirecting to auth.");
            setUser(null as any); 
            setToken(null as any); 
            router.replace('/auth'); 
        } 
        // We no longer handle SIGNED_IN redirect here post-signup, 
        // as the useSignup polling handles that specific flow.
        // We might still update user state for other events if needed:
        else if (event === 'USER_UPDATED' && session) {
             console.log("AuthEvent: USER_UPDATED detected.");
             setUser(session.user);
             setToken(session.access_token); // Token might not change, but session object might
        }
        else if (event === 'TOKEN_REFRESHED' && session) {
            console.log("AuthEvent: TOKEN_REFRESHED detected.");
            setToken(session.access_token); // Update token specifically
        }
        // Other events like PASSWORD_RECOVERY, USER_DELETED could be handled here.
    });

    authListener = result.data.subscription;

    // Cleanup listener on unmount
    return () => {
      console.log("AuthEvent: Unsubscribing listener.");
      authListener?.unsubscribe();
    };
  }, [setUser, setToken])
}

export default useAuthEvent;
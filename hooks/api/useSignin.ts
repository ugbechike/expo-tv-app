import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useAuth } from "@/store/authSlice";
import { AuthChangeEvent, Session, Subscription, User } from '@supabase/supabase-js';

export const useSignin = (options?: {
  onPollingStart?: () => void;
  onPollingEnd?: (session: Session | null) => void;
}) => {
  const { setUser, setToken } = useAuth();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log("Signin: mutationFn started", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Signin: mutationFn finished", { data, error });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log("Signin: onSuccess triggered. Starting confirmation polling.");
      setUser(data.session.user);
      setToken(data.session.access_token);
      router.replace('/(tabs)');
    },
    onError: (error) => {
      console.error("Signin onError:", error);
    }
  });
};

export const useSignup = (options?: {
  onPollingStart?: () => void;
  onPollingEnd?: (session: Session | null) => void;
}) => {
  const { setUser, setToken } = useAuth();
  const credentials = { email: '', password: '' }; // Store credentials for later signin

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log("Signup: mutationFn started", { email });
      // Store credentials for later use
      credentials.email = email;
      credentials.password = password;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log("Signup: mutationFn finished", { data, error });

      if (error) {
        console.error("Signup: Supabase signup error:", error);
        throw error; 
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Signup: onSuccess triggered. Starting confirmation polling.");
      options?.onPollingStart?.();
      
      let pollInterval: NodeJS.Timeout | null = null;
      let pollTimeout: NodeJS.Timeout | null = null;
      
      const cleanupPolling = (session: Session | null = null) => {
        if (pollInterval) clearInterval(pollInterval);
        if (pollTimeout) clearTimeout(pollTimeout);
        pollInterval = null;
        pollTimeout = null;
        options?.onPollingEnd?.(session);
      };

      const checkEmailConfirmed = async () => {
        console.log("Signup Polling: Attempting signin to check confirmation...");
        try {
          // Try to sign in with the stored credentials
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (signInError) {
            if (signInError.message.includes('Email not confirmed')) {
              console.log("Signup Polling: Email still not confirmed");
              return false;
            }
            console.error('Signup Polling: Sign in error:', signInError);
            return false;
          }

          if (signInData.session) {
            console.log("Signup Polling: Email confirmed and signed in!");
            setUser(signInData.session.user);
            setToken(signInData.session.access_token);
            cleanupPolling(signInData.session);
            router.replace('/(tabs)');
            return true;
          }
        } catch (error) {
          console.error('Signup Polling: Error during signin check:', error);
        }
        return false;
      };

      // Start polling
      pollInterval = setInterval(checkEmailConfirmed, 5000);

      // Set a timeout to stop polling after 5 minutes
      pollTimeout = setTimeout(() => {
        console.log("Signup Polling: Timeout reached. Stopping poll.");
        cleanupPolling();
      }, 5 * 60 * 1000);
    },
    onError: (error) => {
      console.error("Signup: mutation onError:", error);
      options?.onPollingEnd?.(null);
    }
  });
};


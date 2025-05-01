import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ""

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

const storage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS !== 'web') {
        return await AsyncStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('AsyncStorage error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS !== 'web') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('AsyncStorage error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS !== 'web') {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('AsyncStorage error:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

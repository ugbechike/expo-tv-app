import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { IMovie } from "@/types/movie";

export interface UserData extends User {
  rentedMovies: IMovie[];
  purchasedMovies: IMovie[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

const initialState: AuthState = {
  user: null,       
  token: null,
  setUser: () => {},
  setToken: () => {},
};

export const useAuth = create<AuthState>((set) => ({
  ...initialState,
  setUser: (user: User) => set({ user }),
  setToken: (token: string) => set({ token }),
}));


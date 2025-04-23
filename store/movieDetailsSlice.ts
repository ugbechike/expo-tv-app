import { IMovie } from '@/types/movie';
import { create } from 'zustand'

interface MovieDetailsStore {
    movieDetails: IMovie | null;
    setMovieDetails: (movieDetails: IMovie) => void;
}

export const useMovieDetailsStore = create<MovieDetailsStore>((set) => ({
  movieDetails: null,
  setMovieDetails: (movieDetails: IMovie) => set({ movieDetails }),
}))

import { useQuery } from "@tanstack/react-query";
import trendingMovies from "@/mocks/trendingMovies.json";
import { useMovieDetailsStore } from "@/store/movieDetailsSlice";

export const useGetMovies = () => {
    const { setMovieDetails } = useMovieDetailsStore();

  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await Promise.resolve(trendingMovies);
      setMovieDetails(response.results[0]);
      return response;
    },
  });
};
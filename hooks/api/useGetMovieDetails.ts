import { useQuery } from "@tanstack/react-query";
import trendingMovies from '@/mocks/trendingMovies.json';


const getMovieDetails = async (id: number) => {
    const response = trendingMovies.results.find(movie => movie.id === id);
    return response;
}
export const useGetMovieDetails = function (id: number) {
    return useQuery({
        queryKey: ['movieDetails', id],
        queryFn: async () => await getMovieDetails(id),
        enabled: !!id,
    });
}   
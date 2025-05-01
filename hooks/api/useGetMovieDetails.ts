import { useQuery } from "@tanstack/react-query";
import trendingMovies from '@/mocks/trendingMovies.json';
import { useGetUser } from "./useGetUser";

const getMovieDetails = async (id: number) => {
    const response = trendingMovies.results.find(movie => movie.id === id);
    return response;
}
export const useGetMovieDetails = function (id: number) {
    const {data: user} = useGetUser();
    const isPurchased = user?.purchasedMovies.some(movie => movie.id === id);
    const isRented = user?.rentedMovies.some(movie => movie.id === id);
    return useQuery({
        queryKey: ['movieDetails', id],
        queryFn: async () => {
            if(!id) return;
            const response = await getMovieDetails(id);
            return {...response, isPurchased, isRented};
        },

        enabled: !!id,
    });
}   
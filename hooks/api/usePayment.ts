import { useQuery } from "@tanstack/react-query";

export const usePayment = () => {
    return useQuery({
        queryKey: ["payment"],      
        queryFn: async () => {
            const response = await fetch("/api/payment-intent");
            return response.json();
        },
        // enabled: !!user,
    });
};
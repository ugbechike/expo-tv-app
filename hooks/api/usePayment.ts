import { useQuery } from "@tanstack/react-query";

export const usePayment = () => {
    return useQuery({
        queryKey: ["payment"],
        queryFn: () => fetch("/api/payment").then((res) => res.json()),
        // enabled: !!user,
    });
};
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./http";

export const useGetProfile = () => {
    return useQuery({
        queryKey: ["getProfile"],
        queryFn: () => getProfile(),
    });
};
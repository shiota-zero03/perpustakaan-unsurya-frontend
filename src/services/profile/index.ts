import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "./http";
import { GetProfileInterface } from "@/interface/response/Profile.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";

export const useGetProfile = () => {
    return useQuery({
        queryKey: ["getProfile"],
        queryFn: () => getProfile(),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation<GetProfileInterface, AxiosError<BaseErrorRes>, FormData>({
        mutationFn: ( data ) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateProfile"] });
        },
        onError: (error) => {
            throw error;
        },
    });
  };
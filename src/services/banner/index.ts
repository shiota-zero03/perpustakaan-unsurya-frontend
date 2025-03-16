import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBanner, getDetailBanner, getListBanner, storeBanner, updateBanner } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IBannerDetailRes } from "@/interface/response/Banner.interface";
import { BannerInterfaceReq } from "@/interface/request/Banner.interface";

export const useGetListBanner = (
    limit: number | null,
    page: number | null,
    title: string | null
) => {
    return useQuery({
        queryKey: ["getListBanner"],
        queryFn: () => getListBanner(limit, page, title),
        staleTime: 300000,
    });
};

export const useDeletedBanner = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteBanner(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteBanner"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreBanner = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBannerDetailRes, AxiosError<BaseErrorRes>, BannerInterfaceReq>({
        mutationFn: ( data ) => storeBanner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeBanner"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailBanner = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailBanner"],
        queryFn: () => getDetailBanner(userId),
        staleTime: 300000,
    });
};

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBannerDetailRes, AxiosError<BaseErrorRes>, {data: BannerInterfaceReq, id: string}>({
        mutationFn: ( { data, id } ) => updateBanner(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateBanner"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
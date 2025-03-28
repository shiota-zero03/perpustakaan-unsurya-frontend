import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNews, getDetailNews, getListNews, storeNews, updateNews } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { INewsDetailRes } from "@/interface/response/News.interface";

export const useGetListNews = (
    limit: number | null,
    page: number | null,
    title: string | null,
    author: string | null,
) => {
    return useQuery({
        queryKey: ["getListNews"],
        queryFn: () => getListNews(limit, page, title, author),
        staleTime: 300000,
    });
};

export const useDeletedNews = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteNews(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteNews"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreNews = () => {
    const queryClient = useQueryClient();
  
    return useMutation<INewsDetailRes, AxiosError<BaseErrorRes>, FormData>({
        mutationFn: ( data ) => storeNews(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeNews"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailNews = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailNews"],
        queryFn: () => getDetailNews(userId),
        staleTime: 300000,
    });
};

export const useUpdateNews = () => {
    const queryClient = useQueryClient();
  
    return useMutation<INewsDetailRes, AxiosError<BaseErrorRes>, {data: FormData, id: string}>({
        mutationFn: ( { data, id } ) => updateNews(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateNews"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
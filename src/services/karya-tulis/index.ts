import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteKaryaTulis, getDetailKaryaTulis, getListKaryaTulis, postSelectionKaryaTulis, storeKaryaTulis, updateKaryaTulis } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IKaryaTulisDetailRes } from "@/interface/response/KaryaTulis.interface";

export const useGetListKaryaTulis = (
    limit: number | null,
    page: number | null,
    nim: string | null,
    judul: string | null,
    penulis: string | null,
    tahun: string | null
) => {
    return useQuery({
        queryKey: ["getListKaryaTulis"],
        queryFn: () => getListKaryaTulis(limit, page, nim, judul, penulis, tahun),
        staleTime: 300000,
    });
};

export const usePostSelectedKaryaTulis = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, SelectedDataReq>({
        mutationFn: ( formData ) => postSelectionKaryaTulis(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["postSelectionKaryaTulis"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useDeletedKaryaTulis = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteKaryaTulis(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteKaryaTulis"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreKaryaTulis = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IKaryaTulisDetailRes, AxiosError<BaseErrorRes>, FormData>({
        mutationFn: ( data ) => storeKaryaTulis(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeKaryaTulis"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailKaryaTulis = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailKaryaTulis"],
        queryFn: () => getDetailKaryaTulis(userId),
        staleTime: 300000,
    });
};

export const useUpdateKaryaTulis = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IKaryaTulisDetailRes, AxiosError<BaseErrorRes>, {data: FormData, userId: string}>({
        mutationFn: ( { data, userId } ) => updateKaryaTulis(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateKaryaTulis"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBukuDigital, getDetailBukuDigital, getListBukuDigital, importBukuDigital, postSelectionBukuDigital, storeBukuDigital, updateBukuDigital } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IBukuDigitalDetailRes } from "@/interface/response/BukuDigital.interface";

export const useGetListBukuDigital = (
    limit: number | null,
    page: number | null,
    judul: string | null,
    penulis: string | null,
    tahun: string | null
) => {
    return useQuery({
        queryKey: ["getListBukuDigital"],
        queryFn: () => getListBukuDigital(limit, page, judul, penulis, tahun),
        staleTime: 300000,
    });
};

export const usePostSelectedBukuDigital = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, SelectedDataReq>({
        mutationFn: ( formData ) => postSelectionBukuDigital(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["postSelectionBukuDigital"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useDeletedBukuDigital = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteBukuDigital(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteBukuDigital"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreBukuDigital = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBukuDigitalDetailRes, AxiosError<BaseErrorRes>, FormData>({
        mutationFn: ( data ) => storeBukuDigital(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeBukuDigital"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailBukuDigital = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailBukuDigital"],
        queryFn: () => getDetailBukuDigital(userId),
        staleTime: 300000,
    });
};

export const useUpdateBukuDigital = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBukuDigitalDetailRes, AxiosError<BaseErrorRes>, {data: FormData, userId: string}>({
        mutationFn: ( { data, userId } ) => updateBukuDigital(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateBukuDigital"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useImportBukuDigital = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBukuDigitalDetailRes, AxiosError<BaseErrorRes>, { dataImport: string }>({
        mutationFn: ( data ) => importBukuDigital(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["importBukuDigital"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
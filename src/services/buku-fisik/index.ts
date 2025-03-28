import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBukuFisik, getDetailBukuFisik, getListBukuFisik, importBukuFisik, postSelectionBukuFisik, storeBukuFisik, updateBukuFisik } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IBukuFisikDetailRes } from "@/interface/response/BukuFisik.interface";

export const useGetListBukuFisik = (
    limit: number | null,
    page: number | null,
    judul: string | null,
    penulis: string | null,
    tahun: string | null
) => {
    return useQuery({
        queryKey: ["getListBukuFisik"],
        queryFn: () => getListBukuFisik(limit, page, judul, penulis, tahun),
        staleTime: 300000,
    });
};

export const usePostSelectedBukuFisik = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, SelectedDataReq>({
        mutationFn: ( formData ) => postSelectionBukuFisik(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["postSelectionBukuFisik"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useDeletedBukuFisik = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteBukuFisik(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteBukuFisik"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreBukuFisik = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBukuFisikDetailRes, AxiosError<BaseErrorRes>, FormData>({
        mutationFn: ( data ) => storeBukuFisik(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeBukuFisik"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailBukuFisik = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailBukuFisik"],
        queryFn: () => getDetailBukuFisik(userId),
        staleTime: 300000,
    });
};

export const useUpdateBukuFisik = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBukuFisikDetailRes, AxiosError<BaseErrorRes>, {data: FormData, userId: string}>({
        mutationFn: ( { data, userId } ) => updateBukuFisik(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateBukuFisik"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useImportBukuFisik = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IBukuFisikDetailRes, AxiosError<BaseErrorRes>, { dataImport: string }>({
        mutationFn: ( data ) => importBukuFisik(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["importBukuFisik"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
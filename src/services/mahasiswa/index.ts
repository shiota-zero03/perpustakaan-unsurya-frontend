import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cronMahasiswa, deleteMahasiswa, getDetailMahasiswa, getListMahasiswa, importMahasiswa, postSelectionMahasiswa, storeMahasiswa, updateMahasiswa } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IMahasiswaDetailRes } from "@/interface/response/Mahasiswa.interface";

export const useGetListMahasiswa = (
    limit: number | null,
    page: number | null,
    name: string | null,
    nim: string | null,
    status: string | null
) => {
    return useQuery({
        queryKey: ["getListMahasiswa", limit, page, name, nim, status],
        queryFn: () => getListMahasiswa(limit, page, name, nim, status),
        staleTime: 300000,
    });
};

export const usePostSelectedMahasiswa = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, SelectedDataReq>({
        mutationFn: ( formData ) => postSelectionMahasiswa(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["postSelectionMahasiswa"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useDeletedMahasiswa = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteMahasiswa(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteMahasiswa"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useCronMahasiswa = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IMahasiswaDetailRes, AxiosError<BaseErrorRes>, null>({
        mutationFn: () => cronMahasiswa(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cronMahasiswa"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
export const useStoreMahasiswa = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IMahasiswaDetailRes, AxiosError<BaseErrorRes>, FormData>({
        mutationFn: ( data ) => storeMahasiswa(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeMahasiswa"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailMahasiswa = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailMahasiswa", userId],
        queryFn: () => getDetailMahasiswa(userId),
        staleTime: 300000,
    });
};

export const useUpdateMahasiswa = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IMahasiswaDetailRes, AxiosError<BaseErrorRes>, {data: FormData, userId: string}>({
        mutationFn: ( { data, userId } ) => updateMahasiswa(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateMahasiswa"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useImportMahasiswa = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IMahasiswaDetailRes, AxiosError<BaseErrorRes>, { dataImport: string }>({
        mutationFn: ( data ) => importMahasiswa(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["importMahasiswa"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
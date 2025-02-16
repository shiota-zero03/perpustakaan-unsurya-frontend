import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDosen, getDetailDosen, getListDosen, importDosen, postSelectionDosen, storeDosen, updateDosen } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IDosenDetailRes } from "@/interface/response/Dosen.interface";
import { DosenInterfaceReq } from "@/interface/request/Dosen.interface";

export const useGetListDosen = (
    limit: number | null,
    page: number | null,
    name: string | null,
    nidn: string | null,
    status: string | null
) => {
    return useQuery({
        queryKey: ["getListDosen"],
        queryFn: () => getListDosen(limit, page, name, nidn, status),
        staleTime: 300000,
    });
};

export const usePostSelectedDosen = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, SelectedDataReq>({
        mutationFn: ( formData ) => postSelectionDosen(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["postSelectionDosen"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useDeletedDosen = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteDosen(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteDosen"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreDosen = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IDosenDetailRes, AxiosError<BaseErrorRes>, DosenInterfaceReq>({
        mutationFn: ( data ) => storeDosen(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeDosen"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailDosen = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailDosen"],
        queryFn: () => getDetailDosen(userId),
        staleTime: 300000,
    });
};

export const useUpdateDosen = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IDosenDetailRes, AxiosError<BaseErrorRes>, {data: DosenInterfaceReq, userId: string}>({
        mutationFn: ( { data, userId } ) => updateDosen(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateDosen"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useImportDosen = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IDosenDetailRes, AxiosError<BaseErrorRes>, { dataImport: string }>({
        mutationFn: ( data ) => importDosen(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["importDosen"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
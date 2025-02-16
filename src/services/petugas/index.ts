import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePetugas, getDetailPetugas, getListPetugas, postSelectionPetugas, storePetugas, updatePetugas } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IPetugasDetailRes } from "@/interface/response/Petugas.interface";
import { PetugasInterfaceReq } from "@/interface/request/Petugas.interface";

export const useGetListPetugas = (
    limit: number | null,
    page: number | null,
    name: string | null,
    email: string | null,
    status: string | null
) => {
    return useQuery({
        queryKey: ["getListPetugas"],
        queryFn: () => getListPetugas(limit, page, name, email, status),
        staleTime: 300000,
    });
};

export const usePostSelectedPetugas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, SelectedDataReq>({
        mutationFn: ( formData ) => postSelectionPetugas(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["postSelectionPetugas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useDeletedPetugas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deletePetugas(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deletePetugas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStorePetugas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IPetugasDetailRes, AxiosError<BaseErrorRes>, PetugasInterfaceReq>({
        mutationFn: ( data ) => storePetugas(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storePetugas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailPetugas = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailPetugas"],
        queryFn: () => getDetailPetugas(userId),
        staleTime: 300000,
    });
};

export const useUpdatePetugas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IPetugasDetailRes, AxiosError<BaseErrorRes>, {data: PetugasInterfaceReq, userId: string}>({
        mutationFn: ( { data, userId } ) => updatePetugas(data, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updatePetugas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
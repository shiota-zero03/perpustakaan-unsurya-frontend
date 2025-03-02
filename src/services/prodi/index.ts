import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProdi, getDetailProdi, getListProdi, storeProdi, updateProdi } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IProdiDetailRes } from "@/interface/response/Prodi.interface";
import { ProdiInterfaceReq } from "@/interface/request/Prodi.interface";

export const useGetListProdi = (
    limit: number | null,
    page: number | null,
    name: string | null,
    code: string | null,
    fakultas: string | null,
) => {
    return useQuery({
        queryKey: ["getListProdi"],
        queryFn: () => getListProdi(limit, page, name, code, fakultas),
        staleTime: 300000,
    });
};

export const useDeletedProdi = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteProdi(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteProdi"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreProdi = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IProdiDetailRes, AxiosError<BaseErrorRes>, ProdiInterfaceReq>({
        mutationFn: ( data ) => storeProdi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeProdi"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailProdi = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailProdi"],
        queryFn: () => getDetailProdi(userId),
        staleTime: 300000,
    });
};

export const useUpdateProdi = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IProdiDetailRes, AxiosError<BaseErrorRes>, {data: ProdiInterfaceReq, id: string}>({
        mutationFn: ( { data, id } ) => updateProdi(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateProdi"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
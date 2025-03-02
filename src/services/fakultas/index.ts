import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFakultas, getDetailFakultas, getListFakultas, storeFakultas, updateFakultas } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { IFakultasDetailRes } from "@/interface/response/Fakultas.interface";
import { FakultasInterfaceReq } from "@/interface/request/Fakultas.interface";

export const useGetListFakultas = (
    limit: number | null,
    page: number | null,
    name: string | null,
    code: string | null,
) => {
    return useQuery({
        queryKey: ["getListFakultas"],
        queryFn: () => getListFakultas(limit, page, name, code),
        staleTime: 300000,
    });
};

export const useDeletedFakultas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteFakultas(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteFakultas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreFakultas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IFakultasDetailRes, AxiosError<BaseErrorRes>, FakultasInterfaceReq>({
        mutationFn: ( data ) => storeFakultas(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeFakultas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailFakultas = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailFakultas"],
        queryFn: () => getDetailFakultas(userId),
        staleTime: 300000,
    });
};

export const useUpdateFakultas = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IFakultasDetailRes, AxiosError<BaseErrorRes>, {data: FakultasInterfaceReq, id: string}>({
        mutationFn: ( { data, id } ) => updateFakultas(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateFakultas"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
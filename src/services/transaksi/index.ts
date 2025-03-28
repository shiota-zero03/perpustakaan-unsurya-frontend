import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, getDetailTransaction, getListTransaction, storeTransaction, updateTransaction, getListDenda, getDetailDenda, updateDenda } from "./http";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { ITransactionDetailRes } from "@/interface/response/Transaction.interface";
import { TransaksiInterfaceReq } from "@/interface/request/Transaction.interface";

export const useGetListTransaction = (
    limit: number | null,
    page: number | null,
    title: string | null,
    name: string | null,
    startDate: string | null,
    endDate: string | null
) => {
    return useQuery({
        queryKey: ["getListTransaction"],
        queryFn: () => getListTransaction(limit, page, title, name, startDate, endDate),
        staleTime: 300000,
    });
};

export const useGetListDenda = (
    limit: number | null,
    page: number | null,
    name: string | null,
    kode: string | null,
    startDate: string | null,
    endDate: string | null
) => {
    return useQuery({
        queryKey: ["getListDenda"],
        queryFn: () => getListDenda(limit, page, name, kode, startDate, endDate),
        staleTime: 300000,
    });
};

export const useDeletedTransaction = () => {
    const queryClient = useQueryClient();
  
    return useMutation<TrueResponseInterface, AxiosError<BaseErrorRes>, { userId: string }>({
        mutationFn: ({userId}) => deleteTransaction(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deleteTransaction"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useStoreTransaction = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ITransactionDetailRes, AxiosError<BaseErrorRes>, TransaksiInterfaceReq>({
        mutationFn: ( data ) => storeTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeTransaction"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetDetailTransaction = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailTransaction"],
        queryFn: () => getDetailTransaction(userId),
        staleTime: 300000,
    });
};

export const useGetDetailDenda = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailDenda"],
        queryFn: () => getDetailDenda(userId),
        staleTime: 300000,
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ITransactionDetailRes, AxiosError<BaseErrorRes>, {data: TransaksiInterfaceReq, id: string}>({
        mutationFn: ( { data, id } ) => updateTransaction(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateTransaction"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useUpdateDenda = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ITransactionDetailRes, AxiosError<BaseErrorRes>, {data: TransaksiInterfaceReq, id: string}>({
        mutationFn: ( { data, id } ) => updateDenda(data, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateDenda"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
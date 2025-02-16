import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getListVisitor, storeVisitor } from "./http";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import VisitorPost from "@/interface/request/Visitor";
import { IVisitorRes } from "@/interface/response/Visitor.interface";

export const useStoreVisitor = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IVisitorRes, AxiosError<BaseErrorRes>, VisitorPost>({
        mutationFn: ( formData ) => storeVisitor(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["storeVisitor"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useGetListVisitor = (
    limit: number | null,
    page: number | null,
    identityNumber: string | null,
    name: string | null,
    date: string | null
) => {
    return useQuery({
        queryKey: ["getListVisitor"],
        queryFn: () => getListVisitor(limit, page, identityNumber, name, date),
        staleTime: 300000,
    });
};
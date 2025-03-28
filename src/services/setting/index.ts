import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailSetting, updateSetting } from "./http";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { ISettingDetailRes } from "@/interface/response/Setting.interface";
import { SettingInterfaceReq } from "@/interface/request/Setting.interface";

export const useGetDetailSetting = () => {
    return useQuery({
        queryKey: ["getDetailSetting"],
        queryFn: () => getDetailSetting(),
        staleTime: 300000,
    });
};

export const useUpdateSetting = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ISettingDetailRes, AxiosError<BaseErrorRes>, SettingInterfaceReq>({
        mutationFn: (data) => updateSetting(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["updateSetting"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
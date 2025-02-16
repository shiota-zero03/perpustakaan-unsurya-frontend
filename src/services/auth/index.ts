import { ILoginReq, IRegisterReq, IResetReq } from "@/interface/request/Auth.interface";
import { IRegisterRes, ITokenRes } from "@/interface/response/Auth.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authLogin, authLogout, authRegister, forgotPassword, resetPassword } from "./http";
import { AxiosError } from "axios";
import { BaseErrorRes, NullDataRes } from "@/interface/response/base.interface";

export const useAuthLogin = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ITokenRes, AxiosError<BaseErrorRes>, ILoginReq>({
        mutationFn: ( formData ) => authLogin(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authLogin"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useAuthRegister = () => {
    const queryClient = useQueryClient();
  
    return useMutation<IRegisterRes, AxiosError<BaseErrorRes>, IRegisterReq>({
        mutationFn: ( formData ) => authRegister(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authRegister"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useAuthForgot = () => {
    const queryClient = useQueryClient();
  
    return useMutation<NullDataRes, AxiosError<BaseErrorRes>, { email: string }>({
        mutationFn: ({ email }) => forgotPassword(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["forgotPassword"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useAuthReset = () => {
    const queryClient = useQueryClient();
  
    return useMutation<NullDataRes, AxiosError<BaseErrorRes>, IResetReq>({
        mutationFn: ( formData ) => resetPassword(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resetPassword"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};

export const useAuthLogout = () => {
    const queryClient = useQueryClient();
  
    return useMutation<NullDataRes, AxiosError<BaseErrorRes>, {}>({
        mutationFn: () => authLogout(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authLogout"] });
        },
        onError: (error) => {
            throw error;
        },
    });
};
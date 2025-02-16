import instance from "@/api/axios";
import { IRegisterRes, ITokenRes } from "@/interface/response/Auth.interface";
import { ILoginReq, IRegisterReq, IResetReq } from "@/interface/request/Auth.interface";
import { NullDataRes } from "@/interface/response/base.interface";

export const authLogin = async (data: ILoginReq): Promise<ITokenRes> => {
  const response = await instance.post(`/auth/sign-in`, data);
  return response.data;
};

export const authRegister = async (data: IRegisterReq): Promise<IRegisterRes> => {
  const response = await instance.post(`/auth/sign-up`, data);
  return response.data;
};

export const forgotPassword = async (email: string): Promise<NullDataRes> => {
  const response = await instance.post(`/auth/forgot-password`, { email: email });
  return response.data;
};

export const resetPassword = async (data: IResetReq): Promise<NullDataRes> => {
  const response = await instance.post(`/auth/reset-password`, data);
  return response.data;
};

export const requestRefreshToken = async (
  refreshToken: string,
): Promise<ITokenRes> => {
  const response = await instance.post(`/auth/refresh-token`, {
    refreshToken,
  });
  return response.data;
};

export const authLogout = async (): Promise<NullDataRes> => {
  const response = await instance.post(`/auth/sign-out`, {});
  return response.data;
};

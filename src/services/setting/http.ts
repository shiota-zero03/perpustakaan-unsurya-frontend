import instance from "@/api/axios";
import { SettingInterfaceReq } from "@/interface/request/Setting.interface";
import { ISettingDetailRes } from "@/interface/response/Setting.interface";


export const getDetailSetting = async ( ): Promise<ISettingDetailRes> => {
  const response = await instance.get(`/setting`);
  return response.data;
};

export const updateSetting = async ( data: SettingInterfaceReq ): Promise<ISettingDetailRes> => {
  const response = await instance.put(`/setting`, data);
  return response.data;
};
import instance from "@/api/axios";
import { GetProfileInterface } from "@/interface/response/Profile.interface";

export const getProfile = async (): Promise<GetProfileInterface> => {
  const response = await instance.get(`/profile`);
  return response.data;
};

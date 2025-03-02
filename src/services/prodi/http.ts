import instance from "@/api/axios";
import { ProdiInterfaceReq } from "@/interface/request/Prodi.interface";
import { IProdiDetailRes, IProdiListRes } from "@/interface/response/Prodi.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListProdi = async (
  limit: number | null,
  page: number | null,
  name: string | null,
  code: string | null,
  fakultas: string | null,
): Promise<IProdiListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (name) params.set("name", name);
  if (code) params.set("code", code);
  if (fakultas) params.set("fakultas", fakultas);

  const link = `/prodi?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const deleteProdi = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/prodi/${userId}`);
  return response.data;
};

export const storeProdi = async ( data: ProdiInterfaceReq ): Promise<IProdiDetailRes> => {
  const response = await instance.post(`/prodi/store`, data);
  return response.data;
};

export const getDetailProdi = async ( userId: string ): Promise<IProdiDetailRes> => {
  const response = await instance.get(`/prodi/${userId}`);
  return response.data;
};

export const updateProdi = async ( data: ProdiInterfaceReq, id: string ): Promise<IProdiDetailRes> => {
  const response = await instance.put(`/prodi/update/${id}`, data);
  return response.data;
};
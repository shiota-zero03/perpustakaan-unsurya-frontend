import instance from "@/api/axios";
import { FakultasInterfaceReq } from "@/interface/request/Fakultas.interface";
import { IFakultasDetailRes, IFakultasListRes } from "@/interface/response/Fakultas.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListFakultas = async (
  limit: number | null,
  page: number | null,
  name: string | null,
  code: string | null,
): Promise<IFakultasListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (name) params.set("name", name);
  if (code) params.set("code", code);

  const link = `/fakultas?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const deleteFakultas = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/fakultas/${userId}`);
  return response.data;
};

export const storeFakultas = async ( data: FakultasInterfaceReq ): Promise<IFakultasDetailRes> => {
  const response = await instance.post(`/fakultas/store`, data);
  return response.data;
};

export const getDetailFakultas = async ( userId: string ): Promise<IFakultasDetailRes> => {
  const response = await instance.get(`/fakultas/${userId}`);
  return response.data;
};

export const updateFakultas = async ( data: FakultasInterfaceReq, id: string ): Promise<IFakultasDetailRes> => {
  const response = await instance.put(`/fakultas/update/${id}`, data);
  return response.data;
};
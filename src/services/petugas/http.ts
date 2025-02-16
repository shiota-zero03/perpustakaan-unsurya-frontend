import instance from "@/api/axios";
import { PetugasInterfaceReq } from "@/interface/request/Petugas.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { IPetugasDetailRes, IPetugasListRes } from "@/interface/response/Petugas.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListPetugas = async (
  limit: number | null,
  page: number | null,
  name: string | null,
  email: string | null,
  status: string | null
): Promise<IPetugasListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (name) params.set("name", name);
  if (email) params.set("email", email);
  if (status) params.set("status", status);

  const link = `/petugas?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const postSelectionPetugas = async ( data: SelectedDataReq ): Promise<TrueResponseInterface> => {
  const response = await instance.post(`/petugas/action-selected`, data);
  return response.data;
};

export const deletePetugas = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/petugas/${userId}`);
  return response.data;
};

export const storePetugas = async ( data: PetugasInterfaceReq ): Promise<IPetugasDetailRes> => {
  const response = await instance.post(`/petugas/store`, data);
  return response.data;
};

export const getDetailPetugas = async ( userId: string ): Promise<IPetugasDetailRes> => {
  const response = await instance.get(`/petugas/${userId}`);
  return response.data;
};

export const updatePetugas = async ( data: PetugasInterfaceReq, userId: string ): Promise<IPetugasDetailRes> => {
  const response = await instance.put(`/petugas/update/${userId}`, data);
  return response.data;
};

export const DataPetugasExport = async () => {
  const link = `/petugas/data/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Data Petugas.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
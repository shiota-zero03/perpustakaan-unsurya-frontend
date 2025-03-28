import instance from "@/api/axios";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { IKaryaTulisDetailRes, IKaryaTulisListRes } from "@/interface/response/KaryaTulis.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListKaryaTulis = async (
  limit: number | null,
  page: number | null,
  nim: string | null,
  judul: string | null,
  penulis: string | null,
  tahun: string | null
): Promise<IKaryaTulisListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (nim) params.set("nim", nim);
  if (judul) params.set("judul", judul);
  if (penulis) params.set("penulis", penulis);
  if (tahun) params.set("tahun", tahun);

  const link = `/karya-tulis?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const postSelectionKaryaTulis = async ( data: SelectedDataReq ): Promise<TrueResponseInterface> => {
  const response = await instance.post(`/karya-tulis/action-selected`, data);
  return response.data;
};

export const deleteKaryaTulis = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/karya-tulis/${userId}`);
  return response.data;
};

export const storeKaryaTulis = async ( data: FormData ): Promise<IKaryaTulisDetailRes> => {
  const response = await instance.post(`/karya-tulis/store`, data);
  return response.data;
};

export const getDetailKaryaTulis = async ( userId: string ): Promise<IKaryaTulisDetailRes> => {
  const response = await instance.get(`/karya-tulis/${userId}`);
  return response.data;
};

export const updateKaryaTulis = async ( data: FormData, userId: string ): Promise<IKaryaTulisDetailRes> => {
  const response = await instance.post(`/karya-tulis/update/${userId}`, data);
  return response.data;
};

export const DataKaryaTulisExport = async () => {
  const link = `/karya-tulis/data/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Data Karya Tulis.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
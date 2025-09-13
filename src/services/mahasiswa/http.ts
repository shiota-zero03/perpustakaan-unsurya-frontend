import instance from "@/api/axios";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { IMahasiswaDetailRes, IMahasiswaListRes } from "@/interface/response/Mahasiswa.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListMahasiswa = async (
  limit: number | null,
  page: number | null,
  name: string | null,
  nim: string | null,
  status: string | null
): Promise<IMahasiswaListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (name) params.set("name", name);
  if (nim) params.set("nim", nim);
  if (status) params.set("status", status);

  const link = `/mahasiswa?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const postSelectionMahasiswa = async ( data: SelectedDataReq ): Promise<TrueResponseInterface> => {
  const response = await instance.post(`/mahasiswa/action-selected`, data);
  return response.data;
};

export const deleteMahasiswa = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/mahasiswa/${userId}`);
  return response.data;
};

export const cronMahasiswa = async (): Promise<IMahasiswaDetailRes> => {
  const response = await instance.post(`/cron/data-anggota`, {});
  return response.data;
};

export const storeMahasiswa = async ( data: FormData ): Promise<IMahasiswaDetailRes> => {
  const response = await instance.post(`/mahasiswa/store`, data);
  return response.data;
};

export const getDetailMahasiswa = async ( userId: string ): Promise<IMahasiswaDetailRes> => {
  const response = await instance.get(`/mahasiswa/${userId}`);
  return response.data;
};

export const updateMahasiswa = async ( data: FormData, userId: string ): Promise<IMahasiswaDetailRes> => {
  const response = await instance.post(`/mahasiswa/update/${userId}`, data);
  return response.data;
};

export const sampleMahasiswaExport = async () => {
  const link = `/mahasiswa/sample/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Mahasiswa Sample Import.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

export const importMahasiswa = async ( data: {dataImport: string} ): Promise<IMahasiswaDetailRes> => {
  const response = await instance.post(`/mahasiswa/data/import`, data);
  return response.data;
};

export const DataMahasiswaExport = async () => {
  const link = `/mahasiswa/data/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Data Mahasiswa.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
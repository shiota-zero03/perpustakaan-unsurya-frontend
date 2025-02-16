import instance from "@/api/axios";
import { DosenInterfaceReq } from "@/interface/request/Dosen.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { IDosenDetailRes, IDosenListRes } from "@/interface/response/Dosen.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListDosen = async (
  limit: number | null,
  page: number | null,
  name: string | null,
  nidn: string | null,
  status: string | null
): Promise<IDosenListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (name) params.set("name", name);
  if (nidn) params.set("nidn", nidn);
  if (status) params.set("status", status);

  const link = `/dosen?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const postSelectionDosen = async ( data: SelectedDataReq ): Promise<TrueResponseInterface> => {
  const response = await instance.post(`/dosen/action-selected`, data);
  return response.data;
};

export const deleteDosen = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/dosen/${userId}`);
  return response.data;
};

export const storeDosen = async ( data: DosenInterfaceReq ): Promise<IDosenDetailRes> => {
  const response = await instance.post(`/dosen/store`, data);
  return response.data;
};

export const getDetailDosen = async ( userId: string ): Promise<IDosenDetailRes> => {
  const response = await instance.get(`/dosen/${userId}`);
  return response.data;
};

export const updateDosen = async ( data: DosenInterfaceReq, userId: string ): Promise<IDosenDetailRes> => {
  const response = await instance.put(`/dosen/update/${userId}`, data);
  return response.data;
};

export const sampleDosenExport = async () => {
  const link = `/dosen/sample/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Dosen Sample Import.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

export const importDosen = async ( data: {dataImport: string} ): Promise<IDosenDetailRes> => {
  const response = await instance.post(`/dosen/data/import`, data);
  return response.data;
};

export const DataDosenExport = async () => {
  const link = `/dosen/data/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Data Dosen.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
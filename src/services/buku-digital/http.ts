import instance from "@/api/axios";
import { BukuDigitalInterfaceReq } from "@/interface/request/BukuDigital.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { IBukuDigitalDetailRes, IBukuDigitalListRes } from "@/interface/response/BukuDigital.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListBukuDigital = async (
  limit: number | null,
  page: number | null,
  judul: string | null,
  penulis: string | null,
  tahun: string | null
): Promise<IBukuDigitalListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (judul) params.set("judul", judul);
  if (penulis) params.set("penulis", penulis);
  if (tahun) params.set("tahun", tahun);

  const link = `/buku-fisik?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const postSelectionBukuDigital = async ( data: SelectedDataReq ): Promise<TrueResponseInterface> => {
  const response = await instance.post(`/buku-fisik/action-selected`, data);
  return response.data;
};

export const deleteBukuDigital = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/buku-fisik/${userId}`);
  return response.data;
};

export const storeBukuDigital = async ( data: BukuDigitalInterfaceReq ): Promise<IBukuDigitalDetailRes> => {
  const response = await instance.post(`/buku-fisik/store`, data);
  return response.data;
};

export const getDetailBukuDigital = async ( userId: string ): Promise<IBukuDigitalDetailRes> => {
  const response = await instance.get(`/buku-fisik/${userId}`);
  return response.data;
};

export const updateBukuDigital = async ( data: BukuDigitalInterfaceReq, userId: string ): Promise<IBukuDigitalDetailRes> => {
  const response = await instance.put(`/buku-fisik/update/${userId}`, data);
  return response.data;
};

export const sampleBukuDigitalExport = async () => {
  const link = `/buku-fisik/sample/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Buku Fisik Sample Import.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

export const importBukuDigital = async ( data: {dataImport: string} ): Promise<IBukuDigitalDetailRes> => {
  const response = await instance.post(`/buku-fisik/data/import`, data);
  return response.data;
};

export const DataBukuDigitalExport = async () => {
  const link = `/buku-fisik/data/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Data Buku Fisik.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
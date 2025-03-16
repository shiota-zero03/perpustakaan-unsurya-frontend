import instance from "@/api/axios";
import { BukuFisikInterfaceReq } from "@/interface/request/BukuFisik.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { IBukuFisikDetailRes, IBukuFisikListRes } from "@/interface/response/BukuFisik.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListBukuFisik = async (
  limit: number | null,
  page: number | null,
  judul: string | null,
  penulis: string | null,
  tahun: string | null
): Promise<IBukuFisikListRes> => {
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

export const postSelectionBukuFisik = async ( data: SelectedDataReq ): Promise<TrueResponseInterface> => {
  const response = await instance.post(`/buku-fisik/action-selected`, data);
  return response.data;
};

export const deleteBukuFisik = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/buku-fisik/${userId}`);
  return response.data;
};

export const storeBukuFisik = async ( data: BukuFisikInterfaceReq ): Promise<IBukuFisikDetailRes> => {
  const response = await instance.post(`/buku-fisik/store`, data);
  return response.data;
};

export const getDetailBukuFisik = async ( userId: string ): Promise<IBukuFisikDetailRes> => {
  const response = await instance.get(`/buku-fisik/${userId}`);
  return response.data;
};

export const updateBukuFisik = async ( data: BukuFisikInterfaceReq, userId: string ): Promise<IBukuFisikDetailRes> => {
  const response = await instance.put(`/buku-fisik/update/${userId}`, data);
  return response.data;
};

export const sampleBukuFisikExport = async () => {
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

export const importBukuFisik = async ( data: {dataImport: string} ): Promise<IBukuFisikDetailRes> => {
  const response = await instance.post(`/buku-fisik/data/import`, data);
  return response.data;
};

export const DataBukuFisikExport = async () => {
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
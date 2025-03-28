import instance from "@/api/axios";
import { TransaksiInterfaceReq } from "@/interface/request/Transaction.interface";
import { ITransactionDetailRes, ITransactionListRes } from "@/interface/response/Transaction.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListTransaction = async (
  limit: number | null,
  page: number | null,
  title: string | null,
  name: string | null,
  startDate: string | null,
  endDate: string | null
): Promise<ITransactionListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (title) params.set("title", title);
  if (name) params.set("name", name);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const link = `/transaksi?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const getListDenda = async (
  limit: number | null,
  page: number | null,
  name: string | null,
  kode: string | null,
  startDate: string | null,
  endDate: string | null
): Promise<ITransactionListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (name) params.set("name", name);
  if (kode) params.set("kode", kode);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const link = `/denda?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const deleteTransaction = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/transaksi/${userId}`);
  return response.data;
};

export const storeTransaction = async ( data: TransaksiInterfaceReq ): Promise<ITransactionDetailRes> => {
  const response = await instance.post(`/transaksi/store`, data);
  return response.data;
};

export const getDetailDenda = async ( userId: string ): Promise<ITransactionDetailRes> => {
  const response = await instance.get(`/denda/${userId}`);
  return response.data;
};

export const getDetailTransaction = async ( userId: string ): Promise<ITransactionDetailRes> => {
  const response = await instance.get(`/transaksi/${userId}`);
  return response.data;
};

export const updateTransaction = async ( data: TransaksiInterfaceReq, id: string ): Promise<ITransactionDetailRes> => {
  const response = await instance.put(`/transaksi/update/${id}`, data);
  return response.data;
};

export const updateDenda = async ( data: TransaksiInterfaceReq, id: string ): Promise<ITransactionDetailRes> => {
  const response = await instance.put(`/denda/update/${id}`, data);
  return response.data;
};

export const TransaksiExport = async () => {
  const link = `/transaksi/data/export`;
  const response = await instance.get(link, {
    responseType: "blob", // Mengatur respons menjadi tipe blob untuk file
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.setAttribute("download", "Data Peminjaman.xlsx");
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
import instance from "@/api/axios";
import { IDashboardChartRes, IDashboardRes } from "@/interface/response/Dashboard.interface";

export const getDashboard = async (): Promise<IDashboardRes> => {
  const response = await instance.get(`/dashboard`);
  return response.data;
};


export const getDashboardTransaksi = async (
  tahun: string
): Promise<IDashboardChartRes> => {
  const params = new URLSearchParams();
  if (tahun) params.set("tahun", tahun)
  const response = await instance.get(`/dashboard/transaksi?${params.toString()}`);
  return response.data;
};


export const getDashboardKunjungan = async (
  tahun: string
): Promise<IDashboardChartRes> => {
  const params = new URLSearchParams();
  if (tahun) params.set("tahun", tahun);
  const response = await instance.get(`/dashboard/kunjungan?${params.toString()}`);
  return response.data;
};

import instance from "@/api/axios";
import { BannerInterfaceReq } from "@/interface/request/Banner.interface";
import { IBannerDetailRes, IBannerListRes } from "@/interface/response/Banner.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListBanner = async (
  limit: number | null,
  page: number | null,
  title: string | null
): Promise<IBannerListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (title) params.set("title", title);

  const link = `/banner?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const deleteBanner = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/banner/${userId}`);
  return response.data;
};

export const storeBanner = async ( data: BannerInterfaceReq ): Promise<IBannerDetailRes> => {
  const response = await instance.post(`/banner/store`, data);
  return response.data;
};

export const getDetailBanner = async ( userId: string ): Promise<IBannerDetailRes> => {
  const response = await instance.get(`/banner/${userId}`);
  return response.data;
};

export const updateBanner = async ( data: BannerInterfaceReq, id: string ): Promise<IBannerDetailRes> => {
  const response = await instance.put(`/banner/update/${id}`, data);
  return response.data;
};
import instance from "@/api/axios";
import { INewsDetailRes, INewsListRes } from "@/interface/response/News.interface";
import { TrueResponseInterface } from "@/interface/response/Utils.interface";

export const getListNews = async (
  limit: number | null,
  page: number | null,
  title: string | null,
  author: string | null
): Promise<INewsListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (title) params.set("title", title);
  if (author) params.set("author", author);

  const link = `/news?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};

export const deleteNews = async ( userId: string ): Promise<TrueResponseInterface> => {
  const response = await instance.delete(`/news/${userId}`);
  return response.data;
};

export const storeNews = async ( data: FormData ): Promise<INewsDetailRes> => {
  const response = await instance.post(`/news/store`, data);
  return response.data;
};

export const getDetailNews = async ( userId: string ): Promise<INewsDetailRes> => {
  const response = await instance.get(`/news/${userId}`);
  return response.data;
};

export const updateNews = async ( data: FormData, id: string ): Promise<INewsDetailRes> => {
  const response = await instance.post(`/news/update/${id}`, data, {
      headers: {
          "Content-Type": "multipart/form-data",
      },
  });
  return response.data;
};
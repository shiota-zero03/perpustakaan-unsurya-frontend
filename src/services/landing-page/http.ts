import instance from "@/api/axios";
import { IKaryaTulisDetailRes, IKaryaTulisListRes } from "@/interface/response/KaryaTulis.interface";
import { IBannerRes, IBukuDetailRes, IBukuListRes } from "@/interface/response/LandingPage.interface";
import { INewsDetailRes, INewsListRes } from "@/interface/response/News.interface";
import { ISettingDetailRes } from "@/interface/response/Setting.interface";

export const getBanner = async (): Promise<IBannerRes> => {
    const link = `/landing-page/banner`;
    const response = await instance.get(link);
    return response.data;
};

export const getNews = async (
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
  
    const link = `/landing-page/news?${params.toString()}`;
    const response = await instance.get(link);
    return response.data;
};

export const getDetailNews = async ( userId: string ): Promise<INewsDetailRes> => {
    const response = await instance.get(`/landing-page/news/${userId}`);
    return response.data;
};
  

export const getSetting = async ( ): Promise<ISettingDetailRes> => {
    const response = await instance.get(`/landing-page/profil`);
    return response.data;
};

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
  
    const link = `/landing-page/repository?${params.toString()}`;
    const response = await instance.get(link);
    return response.data;
};

export const getDetailRepository = async ( userId: string ): Promise<IKaryaTulisDetailRes> => {
    const response = await instance.get(`/landing-page/repository/${userId}`);
    return response.data;
  };

export const getListBuku = async (
  limit: number | null,
  page: number | null,
  judul: string | null,
  penulis: string | null,
  tahun: string | null
): Promise<IBukuListRes> => {
  const params = new URLSearchParams();

  if (page) params.set("page", page.toString());
  if (limit) params.set("limit", limit.toString());
  if (judul) params.set("judul", judul);
  if (penulis) params.set("penulis", penulis);
  if (tahun) params.set("tahun", tahun);

  const link = `/landing-page/katalog?${params.toString()}`;
  const response = await instance.get(link);
  return response.data;
};
  
export const getDetailBuku = async ( userId: string ): Promise<IBukuDetailRes> => {
  const response = await instance.get(`/landing-page/katalog/${userId}`);
  return response.data;
};
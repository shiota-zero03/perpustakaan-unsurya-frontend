import { useQuery } from "@tanstack/react-query";
import { getBanner, getDetailBuku, getDetailNews, getDetailRepository, getListBuku, getListKaryaTulis, getNews, getSetting } from "./http";

export const useGetBanner = () => {
    return useQuery({
        queryKey: ["getBannerLanding"],
        queryFn: () => getBanner(),
        staleTime: 300000,
    });
};

export const useGetNews = (
    limit: number | null,
    page: number | null,
    title: string | null,
    author: string | null
) => {
    return useQuery({
        queryKey: ["getNewsLanding", limit, page, title, author],
        queryFn: () => getNews(limit, page, title, author),
        staleTime: 300000,
    });
};

export const useGetDetailNews = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailNewsLanding"],
        queryFn: () => getDetailNews(userId),
        staleTime: 300000,
    });
};

export const useGetSetting = () => {
    return useQuery({
        queryKey: ["getSettingLanding"],
        queryFn: () => getSetting(),
        staleTime: 300000,
    });
};

export const useGetListKaryaTulis = (
    limit: number | null,
    page: number | null,
    nim: string | null,
    judul: string | null,
    penulis: string | null,
    tahun: string | null
) => {
    return useQuery({
        queryKey: ["getListKaryaTulisLanding"],
        queryFn: () => getListKaryaTulis(limit, page, nim, judul, penulis, tahun),
        staleTime: 300000,
    });
};

export const useGetDetailRepository = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailRepositoryLanding"],
        queryFn: () => getDetailRepository(userId),
        staleTime: 300000,
    });
};

export const useGetListBuku = (
    limit: number | null,
    page: number | null,
    judul: string | null,
    penulis: string | null,
    tahun: string | null,
    prodi: string | null,
) => {
    return useQuery({
        queryKey: ["getListBukuLanding"],
        queryFn: () => getListBuku(limit, page, judul, penulis, tahun, prodi),
        staleTime: 300000,
    });
};

export const useGetDetailBuku = (
    userId: string
) => {
    return useQuery({
        queryKey: ["getDetailBukuLanding"],
        queryFn: () => getDetailBuku(userId),
        staleTime: 300000,
    });
};
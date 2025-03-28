import { useQuery } from "@tanstack/react-query";
import { getDashboard, getDashboardKunjungan, getDashboardTransaksi } from "./http";

export const useGetDashgetDashboard = () => {
    return useQuery({
        queryKey: ["getDashboard"],
        queryFn: () => getDashboard(),
        staleTime: 300000,
    });
};

export const useGetDashgetDashboardTransaksi = ( tahun: string ) => {
    return useQuery({
        queryKey: ["getDashboardTransaksi"],
        queryFn: () => getDashboardTransaksi(tahun),
        staleTime: 300000,
    });
};

export const useGetDashgetDashboardKunjungan = (tahun: string) => {
    return useQuery({
        queryKey: ["getDashboardKunjungan"],
        queryFn: () => getDashboardKunjungan(tahun),
        staleTime: 300000,
    });
};
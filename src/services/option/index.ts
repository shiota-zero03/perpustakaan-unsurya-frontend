import { useQuery } from "@tanstack/react-query";
import { getAllAnggota, getAllBuku, getAllDepartment, getAllFaculty } from "./http";

export const useGetAllFaculty = () => {
    return useQuery({
        queryKey: ["getAllFaculty"],
        queryFn: () => getAllFaculty(),
        staleTime: 300000,
    });
};
export const useGetAllDepartment = (
    facultyId: string | null
) => {
    return useQuery({
        queryKey: ["getAllDepartment"],
        queryFn: () => getAllDepartment(facultyId),
        staleTime: 300000,
        enabled: !!facultyId
    });
};
export const useGetAllBuku = () => {
    return useQuery({
        queryKey: ["getAllBuku"],
        queryFn: () => getAllBuku(),
        staleTime: 300000,
    });
};
export const useGetAllAnggota = () => {
    return useQuery({
        queryKey: ["getAllAnggota"],
        queryFn: () => getAllAnggota(),
        staleTime: 300000,
    });
};
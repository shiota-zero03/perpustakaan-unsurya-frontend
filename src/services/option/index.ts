import { useQuery } from "@tanstack/react-query";
import { getAllDepartment, getAllFaculty } from "./http";

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
import instance from "@/api/axios";
import { IOptionAnggotaRes, IOptionBukuRes, IOptionIDNameRes } from "@/interface/response/Option.interface";

export const getAllFaculty = async (): Promise<IOptionIDNameRes> => {
    const response = await instance.get(`/option/faculty`);
    return response.data;
};

export const getAllDepartment = async (facultyId: string | null): Promise<IOptionIDNameRes> => {
    const params = new URLSearchParams();
    if (facultyId) params.set("facultyId", facultyId);
    const response = await instance.get(`/option/department?${params.toString()}`);
    return response.data;
};

export const getAllBuku = async (): Promise<IOptionBukuRes> => {
    const response = await instance.get(`/option/buku`);
    return response.data;
};

export const getAllAnggota = async (): Promise<IOptionAnggotaRes> => {
    const response = await instance.get(`/option/anggota`);
    return response.data;
};
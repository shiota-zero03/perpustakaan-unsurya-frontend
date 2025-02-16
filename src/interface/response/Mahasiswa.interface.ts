import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface MahasiswaListRes {
    id: string;
    name: string | null;
    email: string | null;
    nim: string | null;
    status: string | null;
    waktu_terdaftar: string | null;
    gender?: string | null;
    phone?: string | null;
    faculty?: string | null;
    department?: string | null;
}

export interface IMahasiswaListRes extends BaseRes {
    data: {
        data: MahasiswaListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IMahasiswaDetailRes extends BaseRes {
    data: {
        id: string;
        name: string | null;
        email: string | null;
        nim: string | null;
        status: string | null;
        gender: string | null;
        phone_number: string | null;
        valid_until: string | null;
        waktu_terdaftar: string | null;
        profile_picture: string | null;
        faculty: {
            id: number;
            name: string;
        } | null;
        department: {
            id: number;
            name: string;
        } | null;
    }
}
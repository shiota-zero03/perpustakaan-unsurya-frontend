import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface DosenListRes {
    id: string;
    name: string | null;
    email: string | null;
    nidn: string | null;
    status: string | null;
    waktu_terdaftar: string | null;
}

export interface IDosenListRes extends BaseRes {
    data: {
        data: DosenListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IDosenDetailRes extends BaseRes {
    data: {
        id: string;
        name: string | null;
        email: string | null;
        nidn: string | null;
        status: string | null;
        gender: string | null;
        phone_number: string | null;
        valid_until: string | null;
        waktu_terdaftar: string | null;
        profile_picture: string | null;
    }
}
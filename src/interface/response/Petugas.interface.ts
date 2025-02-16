import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface PetugasListRes {
    id: string;
    name: string | null;
    email: string | null;
    status: string | null;
    waktu_terdaftar: string | null;
    gender?: string | null;
    position?: string | null;
}

export interface IPetugasListRes extends BaseRes {
    data: {
        data: PetugasListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IPetugasDetailRes extends BaseRes {
    data: {
        id: string;
        name: string | null;
        email: string | null;
        status: string | null;
        gender: string | null;
        waktu_terdaftar: string | null;
        profile_picture: string | null;
        position: string | null;
    }
}
import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface KaryaTulisListRes {
    id: string;
    cover: string;
    judul: string;
    penulis: string;
    nim: string;
    tahun_terbit: string;
    program_studi: string | null;
}

export interface IKaryaTulisListRes extends BaseRes {
    data: {
        data: KaryaTulisListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IKaryaTulisDetailRes extends BaseRes {
    data: {
        judul: string;
        cover: string;
        penulis: string;
        nim: string;
        faculty: {
            id: number;
            name: string;
        } | null;
        department: {
            id: number;
            name: string;
        } | null;
        tahun_terbit: number;
        jenis: string;
        no_urut: string;
        kode_klasifikasi: string;
        tanggal_masuk: string;
        kode_rak: string;
        denda_harian: number;
        abstrak: string;
        dokumen: {
            id: number | null;
            title: string;
            file: string;
        }[];
    }
}
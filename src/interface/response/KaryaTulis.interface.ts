import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface KaryaTulisListRes {
    id: string;
    cover: string;
    judul: string;
    penulis: string;
    nim: string;
    tahun_terbit: string;
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
        facultyId: number;
        studyProgramId: number;
        tahun_terbit: number;
        jenis: string;
        no_urut: string;
        kode_klasifikasi: string;
        tanggal_masuk: string;
        kode_rak: string;
        denda_harian: string;
        abstrak: string;
        dokumen: {
            judul: string;
            file: string;
        }[];
    }
}
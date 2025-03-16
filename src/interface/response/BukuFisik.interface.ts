import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface BukuFisikListRes {
    id: string;
    cover: string;
    judul: string;
    penulis: string;
    stok: string;
    tahun_terbit: string;
}

export interface IBukuFisikListRes extends BaseRes {
    data: {
        data: BukuFisikListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IBukuFisikDetailRes extends BaseRes {
    data: {
        no_urut: string | null;
        cover: string | null;
        kode_klasifikasi: string | null;
        judul: string | null;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        isbn: string | null;
        tanggal_masuk: string | null;
        kode_rak: string | null;
        stok: number | null;
        denda_harian: number | null;
    }
}
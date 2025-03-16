import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface BukuDigitalListRes {
    id: string;
    cover: string;
    judul: string;
    penulis: string;
    stok: string;
    link_book: string;
}

export interface IBukuDigitalListRes extends BaseRes {
    data: {
        data: BukuDigitalListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IBukuDigitalDetailRes extends BaseRes {
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
        link_book: number | null;
    }
}
import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface BukuDigitalListRes {
    id: string;
    cover: string;
    judul: string;
    penulis: string;
    tahun_terbit: string;
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
        cover: string | null;
        judul: string | null;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        isbn: string | null;
        link_book: string | null;
        locations: string | null;
        language: string | null;
        physical_description: string | null;
        edition: string | null;
    }
}
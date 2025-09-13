import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface BannerRes {
    picture: string;
    title: string | null;
    subtitle: string | null;
}

export interface IBannerRes extends BaseRes {
    data: BannerRes[];
}

export interface BukuListRes {
    id: string;
    cover: string;
    judul: string;
    penulis: string;
    tahun_terbit: string;
    link_book: string;
    edition: string | null;
    isbn: string;
    type: string;
    physical_description: string | null,
    stok: number;
}

export interface IBukuListRes extends BaseRes {
    data: {
        data: BukuListRes[];
        pagination: PaginationBaseRes;
    }
}

export interface IBukuDetailRes extends BaseRes {
    data: {
        cover: string | null;
        judul: string | null;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        isbn: string | null;
        link_book: string | null;
        no_urut: string | null;
        kode_klasifikasi: string | null;
        tanggal_masuk: string | null;
        kode_rak: string | null;
        stok: number | null;
        denda_harian: number | null;
        book_description: string | null;
        locations: string | null;
        language: string | null;
        physical_description: string | null;
        edition: string | null;
        prodi: {
            id: number;
            name: string;
        } | null;
    }
}
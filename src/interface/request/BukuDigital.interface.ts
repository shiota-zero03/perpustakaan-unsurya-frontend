export interface BukuDigitalInterfaceErrorReq {
    cover?: string;
    judul?: string;
    penulis?: string;
    penerbit?: string;
    tahun_terbit?: string;
    isbn?: string;
    link_book?: string;
}
export interface BukuDigitalInterfaceReq {
    cover?: string | null;
    judul?: string | null;
    penulis?: string | null;
    penerbit?: string | null;
    tahun_terbit?: number | null;
    isbn?: string | null;
    link_book?: string | null;
}
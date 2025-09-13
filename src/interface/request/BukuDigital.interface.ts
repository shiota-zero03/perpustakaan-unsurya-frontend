export interface BukuDigitalInterfaceErrorReq {
    cover?: string | null;
    judul?: string | null;
    penulis?: string | null;
    penerbit?: string | null;
    tahun_terbit?: string | null;
    isbn?: string | null;
    link_book?: string | null;
}
export interface BukuDigitalInterfaceReq {
    cover?: File | null;
    judul?: string | null;
    penulis?: string | null;
    penerbit?: string | null;
    tahun_terbit?: number | null;
    isbn?: string | null;
    link_book?: File | string | null;
}
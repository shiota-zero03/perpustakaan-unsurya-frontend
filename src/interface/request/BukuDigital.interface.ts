export interface BukuDigitalInterfaceErrorReq {
    no_urut?: string;
    cover?: string;
    judul?: string;
    penulis?: string;
    penerbit?: string;
    tahun_terbit?: string;
    isbn?: string;
    link_book?: string;

    kode_klasifikasi?: string;
    tanggal_masuk?: string;
    kode_rak?: string;
    stok?: string;
    denda_harian?: string;
}
export interface BukuDigitalInterfaceReq {
    no_urut?: string | null;
    cover?: string | null;
    judul?: string | null;
    penulis?: string | null;
    penerbit?: string | null;
    tahun_terbit?: number | null;
    isbn?: string | null;
    link_book?: string | null;

    kode_klasifikasi?: string | null;
    tanggal_masuk?: string | null;
    kode_rak?: string | null;
    stok?: number | null;
    denda_harian?: number | null;
}
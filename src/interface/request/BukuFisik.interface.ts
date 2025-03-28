export interface BukuFisikInterfaceErrorReq {
    no_urut?: string;
    cover?: string;
    kode_klasifikasi?: string;
    judul?: string;
    penulis?: string;
    penerbit?: string;
    tahun_terbit?: string;
    isbn?: string;
    tanggal_masuk?: string;
    kode_rak?: string;
    stok?: string;
    denda_harian?: string;
}
export interface BukuFisikInterfaceReq {
    no_urut?: string | null;
    cover?: File | null;
    kode_klasifikasi?: string | null;
    judul?: string | null;
    penulis?: string | null;
    penerbit?: string | null;
    tahun_terbit?: number | null;
    isbn?: string | null;
    tanggal_masuk?: string | null;
    kode_rak?: string | null;
    stok?: number | null;
    denda_harian?: number | null;
}
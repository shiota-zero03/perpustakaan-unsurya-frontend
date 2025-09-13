export interface TransaksiInterfaceErrorReq {
    userId?: string | null;
    userName?: string | null;
    bukuId?: string | null;
    tanggal_peminjaman?: string | null;
    jatuh_tempo?: string | null;
    keterangan_peminjaman?: string | null;
    tanggal_pengembalian?: string | null;
    status_pengembalian?: string | null;
    status_pembayaran?: string | null;
    tanggal_bayar?: string | null;
    keterangan_pengembalian?: string | null;
}
export interface TransaksiInterfaceReq {
    userId?: string | null;
    userName?: string | null;
    bukuId?: string | null;
    tanggal_peminjaman?: string | null;
    jatuh_tempo?: string | null;
    keterangan_peminjaman?: string | null;
    tanggal_pengembalian?: string | null;
    status_pengembalian?: string | null;
    status_pembayaran?: string | null;
    tanggal_bayar?: string | null;
    keterangan_pengembalian?: string | null;
}
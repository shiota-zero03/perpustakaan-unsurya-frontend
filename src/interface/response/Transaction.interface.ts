import { BaseRes, PaginationBaseRes } from "./base.interface";

export interface TransactionRes {
    id?: number;
    transaction_code?: string;
    userId?: number | null;
    id_anggota?: string | null;
    nama_anggota?: string | null;
    bukuId?: number | null;
    id_buku?: string | null;
    judul_buku?: string | null;
    penulis?: string | null;
    tanggal_peminjaman?: string | null;
    jatuh_tempo?: string | null;
    keterangan_peminjaman?: string | null;
    tanggal_pengembalian?: string | null;
    status_pengembalian?: string | null;
    keterangan_pengembalian?: string | null;

    transactionId?: number | null;
    total_keterlambatan?: number | null;
    denda_keterlambatan?: number | null;
    status_pembayaran?: string | null;
    tanggal_bayar?: string | null;
}

export interface ITransactionListRes extends BaseRes {
    data: {
        data: TransactionRes[];
        pagination: PaginationBaseRes;
    }
}

export interface ITransactionDetailRes extends BaseRes {
    data: TransactionRes;
}
import { BaseRes } from "./base.interface"

export interface IDashboardRes extends BaseRes {
    data: {
        anggota: string;
        buku: string;
        transaksi: string;

        transaksiHariIni: string;
        pengembalianHariIni: string;
        selisihTransaksi: string;
        statusTransaksi: string;

        transaksiKemarin: string;
        pengembalianKemarin: string;
        selisihPengembalian: string;
        statusPengembalian: string;

        bayarHariIni: string;
        bayarKemarin: string;
        selisihBayar: string;
        statusbayar: string;
    }
}

export interface IDashboardChartRes extends BaseRes {
    data: {
        month: string;
        total: number;
    }[];
}
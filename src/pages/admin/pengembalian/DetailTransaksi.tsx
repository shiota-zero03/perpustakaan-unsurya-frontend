import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Divider, Input, Textarea } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import { errorToast } from "@/utils/toastMessage";
import { TbReport } from "react-icons/tb";
import { useGetDetailTransaction } from "@/services/transaksi";
import { TransactionRes } from "@/interface/response/Transaction.interface";
import { formatDateDMYIn } from "@/utils/dateFormat";

export default function DetailTransaksi(){

    const { slug } = useParams();

    const navigate = useNavigate();

    const [dataToShow, setDatatoShow] = useState<TransactionRes>({
        transaction_code: "",
        userId: null,
        id_anggota: null,
        nama_anggota: null,
        bukuId: null,
        id_buku: null,
        judul_buku: null,
        penulis: null,
        tanggal_peminjaman: null,
        jatuh_tempo: null,
        keterangan_peminjaman: null,
        tanggal_pengembalian: null,
        status_pengembalian: null,
        keterangan_pengembalian: null,
    })

    const { data, isFetching, refetch, error } = useGetDetailTransaction(slug as string)
    const DATA_FETCHING = useMemo(() => {
        return data ? data.data : null;
    }, [data, isFetching, slug])

    useEffect(() => {
        if(DATA_FETCHING) {
            setDatatoShow({
                id: DATA_FETCHING.id,
                transaction_code: DATA_FETCHING.transaction_code,
                userId: DATA_FETCHING.userId,
                id_anggota: DATA_FETCHING.id_anggota,
                nama_anggota: DATA_FETCHING.nama_anggota,
                bukuId: DATA_FETCHING.bukuId,
                id_buku: DATA_FETCHING.id_buku,
                judul_buku: DATA_FETCHING.judul_buku,
                penulis: DATA_FETCHING.penulis,
                tanggal_peminjaman: DATA_FETCHING.tanggal_peminjaman,
                jatuh_tempo: DATA_FETCHING.jatuh_tempo,
                keterangan_peminjaman: DATA_FETCHING.keterangan_peminjaman,
                tanggal_pengembalian: DATA_FETCHING.tanggal_pengembalian,
                status_pengembalian: DATA_FETCHING.status_pengembalian,
                keterangan_pengembalian: DATA_FETCHING.keterangan_pengembalian,
            })
        }
    }, [DATA_FETCHING])

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-transaksi/pengembalian');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])


    return (
        <main className="flex flex-col gap-4">
            {isFetching ? (
                <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                </div>
            ) : null}
            <BreadcrumbWithCustomSeparator icon={TbReport} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">DETAIL PEMINJAMAN DAN PENGEMBALIAN BUKU</h1>
                </div>
                <div>
                    <div className="flex flex-col gap-1 -mt-2">
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                            <div className="sm:col-span-2">
                                <label htmlFor="code" className="text-primary font-semibold text-sm">Kode Transaksi</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="code"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    value={dataToShow.transaction_code}
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="peminjam" className="text-primary font-semibold text-sm">Nama Peminjam</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="peminjam"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    value={dataToShow.nama_anggota || ""}
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="peminjam_id" className="text-primary font-semibold text-sm">ID Peminjam</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="peminjam_id"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    value={dataToShow.id_anggota || ""}
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Divider className="bg-primary my-4" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="bukuId" className="text-primary font-semibold text-sm">ID Buku</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="bukuId"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    value={dataToShow.id_buku || ""}
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="judul" className="text-primary font-semibold text-sm">Judul Buku</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="judul"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    value={dataToShow.judul_buku || ""}
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="penulis" className="text-primary font-semibold text-sm">Penulis</label>
                                <Input
                                    aria-label="Nomor Urut"
                                    id="penulis"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    value={dataToShow.penulis || ""}
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Divider className="bg-primary my-4" />
                            </div>
                            <div>
                                <label htmlFor="tanggal_peminjaman" className="text-primary font-semibold text-sm">Tanggal Peminjaman</label>
                                <Input
                                    value={dataToShow.tanggal_peminjaman ? formatDateDMYIn(dataToShow.tanggal_peminjaman) : "-"}
                                    aria-label="Nomor Urut"
                                    id="tanggal_peminjaman"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Tanggal peminjaman disini"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="jatuh_tempo" className="text-primary font-semibold text-sm">Tanggal Jatuh Tempo</label>
                                <Input
                                    value={dataToShow.jatuh_tempo ? formatDateDMYIn(dataToShow.jatuh_tempo) : "-"}
                                    aria-label="Nomor Urut"
                                    id="jatuh_tempo"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Tanggal peminjaman disini"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="keterangan_peminjaman" className="text-primary font-semibold text-sm">Keterangan Peminjaman</label>
                                <Textarea
                                    value={dataToShow.keterangan_peminjaman || ""}
                                    aria-label="Nomor Urut"
                                    id="keterangan_peminjaman"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Keterangan peminjaman disini"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Divider className="bg-primary my-4" />
                            </div>
                            <div>
                                <label htmlFor="tanggal_pengembalian" className="text-primary font-semibold text-sm">Tanggal Pengembalian</label>
                                <Input
                                    type={"text"}
                                    value={dataToShow.tanggal_pengembalian ? formatDateDMYIn(dataToShow.tanggal_pengembalian) : "-"}
                                    aria-label="Nomor Urut"
                                    id="tanggal_pengembalian"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="jatuh_tempo" className="text-primary font-semibold text-sm">Status Pengembalian</label>
                                <Input
                                    value={dataToShow.status_pengembalian || "-"}
                                    aria-label="Nomor Urut"
                                    id="jatuh_tempo"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="keterangan_pengembalian" className="text-primary font-semibold text-sm">Keterangan Pengembalian</label>
                                <Textarea
                                    value={dataToShow.keterangan_pengembalian || "-"}
                                    aria-label="Nomor Urut"
                                    id="keterangan_pengembalian"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
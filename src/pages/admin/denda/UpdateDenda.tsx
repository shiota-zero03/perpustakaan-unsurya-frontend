import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Input, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";

import { errorToast, successToast } from "@/utils/toastMessage";
import { TbReport } from "react-icons/tb";
import { useGetDetailDenda, useUpdateDenda } from "@/services/transaksi";
import { TransactionRes } from "@/interface/response/Transaction.interface";
import { formatDateDMYIn, formatDateYMD } from "@/utils/dateFormat";
import { TransaksiInterfaceErrorReq, TransaksiInterfaceReq } from "@/interface/request/Transaction.interface";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";

export default function UpdateDenda(){

    const { slug } = useParams();

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<TransaksiInterfaceReq>({
        status_pembayaran: null,
        tanggal_bayar: null,
    })

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

        total_keterlambatan: null,
        denda_keterlambatan: null,
        status_pembayaran: null,
        tanggal_bayar: null,
    })

    const [ formDataError, setFormDataError ] = useState<TransaksiInterfaceErrorReq>({})

    const { data, isFetching, refetch, error } = useGetDetailDenda(slug as string)
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

                total_keterlambatan: DATA_FETCHING.total_keterlambatan,
                denda_keterlambatan: DATA_FETCHING.denda_keterlambatan,
                status_pembayaran: DATA_FETCHING.status_pembayaran,
                tanggal_bayar: DATA_FETCHING.tanggal_bayar,
            })

            setFormData({
                status_pembayaran: DATA_FETCHING.status_pembayaran,
                tanggal_bayar: DATA_FETCHING.tanggal_bayar ? formatDateYMD(DATA_FETCHING.tanggal_bayar) : "",
            })
        }
    }, [DATA_FETCHING])

    useEffect(() => {
        refetch();
        setFormDataError({})
    }, [])

    useEffect(() => {
        if(!isFetching && error) {
            navigate('/data-transaksi/laporan-denda');
            errorToast({ text: "Data tidak ditemukan" })
        }
    }, [isFetching])

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePost} = useUpdateDenda();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        try {
            mutatePost(
                {data: formData, id: slug as string},
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-transaksi/laporan-denda')
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { data, status } = error.response;
                            const { message, errors } = data;

                            errorToast({ text: message || "Terjadi kesalahan yang tidak terduga" });
                            if(status === 422) {
                                setFormDataError({
                                    ...formDataError,
                                    status_pembayaran: errors.status_pembayaran || "",
                                    tanggal_bayar: errors.tanggal_bayar || "",
                                })
                            }
                        } else {
                            errorToast({ text: error.message || "Terjadi kesalahan yang tidak terduga" });
                        }
                        
                        throw error;
                    },
                }
            )
        } catch (error) {
            console.error("Error during form submission:", error);
            isFinished()
            throw error;
        }
    }

    const isFinished = () => {
        setLoadingSend(false);
        onClose();
    }


    return (
        <main className="flex flex-col gap-4">
            {isFetching ? (
                <div className="inset-0 fixed bg-black/10 z-10 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4" />
                </div>
            ) : null}
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSend} 
                text={"Apakah anda yakin untuk menyimpan data ini ?"} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <BreadcrumbWithCustomSeparator icon={TbReport} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">UPDATE LAPORAN DENDA</h1>
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
                                    placeholder="Tanggal pengembalian disini"
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
                                    placeholder="Keterangan pengembalian disini"
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
                                <label htmlFor="total_keterlambatan" className="text-primary font-semibold text-sm">Total Keterlambatan</label>
                                <Input
                                    type={"text"}
                                    value={`${dataToShow.total_keterlambatan} hari`}
                                    aria-label="Nomor Urut"
                                    id="total_keterlambatan"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-danger text-xs font-medium italic placeholder:text-danger cursor-not-allowed",
                                        label: "text-danger font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="denda_keterlambatan" className="text-primary font-semibold text-sm">Denda Keterlambatan</label>
                                <Input
                                    value={dataToShow.denda_keterlambatan ? `Rp ${(dataToShow.denda_keterlambatan).toLocaleString('id-ID')}` : "-"}
                                    aria-label="Nomor Urut"
                                    id="denda_keterlambatan"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-danger text-xs font-medium italic placeholder:text-danger cursor-not-allowed",
                                        label: "text-danger font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="status_pembayaran" className="text-primary font-semibold text-sm">Status Pembayaran</label>
                                <Select
                                    selectedKeys={[formData.status_pembayaran || ""]}
                                    onChange={(e) => setFormData({...formData, status_pembayaran: String(e.target.value)})}
                                    aria-label="Nomor Urut"
                                    id="jatuh_tempo"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="AUTO_FILLED"
                                    classNames={{
                                        trigger: "border border-primary rounded text-danger",
                                        label: "text-danger font-semibold text-sm"
                                    }}
                                >
                                    <SelectItem key={"Belum Dibayar"}>Belum Dibayar</SelectItem>
                                    <SelectItem key={"Belum Lunas"}>Belum Lunas</SelectItem>
                                    <SelectItem key={"Lunas"}>Lunas</SelectItem>
                                </Select>
                                <div className="text-danger italic text-xs">{formDataError.status_pembayaran}</div>
                            </div>
                            <div>
                                <label htmlFor="tanggal_bayar" className="text-primary font-semibold text-sm">Tanggal Bayar</label>
                                <Input
                                    type={"date"}
                                    value={formData.tanggal_bayar || ""}
                                    onChange={(e) => setFormData({...formData, tanggal_bayar: e.target.value})}
                                    aria-label="Nomor Urut"
                                    id="tanggal_bayar"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Masukkan tanggal bayar disini"
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-danger text-xs font-medium italic placeholder:text-danger",
                                        label: "text-danger font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.tanggal_bayar}</div>
                            </div>
                        </div>
                        <div className="pt-2 pb-6">
                            <Button
                                onPress={onOpen}
                                isLoading={loadingSend}
                                variant="bordered"
                                color="primary"
                                size="sm"
                                className="w-full border rounded font-semibold"
                            >
                                SIMPAN
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
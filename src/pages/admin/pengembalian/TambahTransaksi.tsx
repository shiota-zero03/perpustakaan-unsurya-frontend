import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Autocomplete, AutocompleteItem, Button, Divider, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";

import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { TbReport } from "react-icons/tb";
import { TransaksiInterfaceErrorReq, TransaksiInterfaceReq } from "@/interface/request/Transaction.interface";
import { useGetAllAnggota, useGetAllBuku } from "@/services/option";
import { useStoreTransaction } from "@/services/transaksi";
import { FaQrcode } from "react-icons/fa6";
import { ScanAnggota, ScanBuku } from "@/components/Modals/scan/ScanBarcode";

export default function TambahTransaksi(){

    const navigate = useNavigate();

    const [ formData, setFormData ] = useState<TransaksiInterfaceReq>({
        userId: null,
        bukuId: null,
        tanggal_peminjaman: null,
        jatuh_tempo: null,
        keterangan_peminjaman: null,
    })

    const [ formDataError, setFormDataError ] = useState<TransaksiInterfaceErrorReq>({})

    const { data: dataAnggota, isFetching: isFetchingAnggota, refetch: refetchAnggota } = useGetAllAnggota();
    const { data: dataBuku, isFetching: isFetchingBuku, refetch: refetchBuku } = useGetAllBuku();

    const [ searchAnggota, setSearchAnggota ] = useState<string>("")
    const [ searchBuku, setSearchBuku ] = useState<string>("")

    const DATA_ANGGOTA = useMemo(() => {
        return dataAnggota ? dataAnggota.data : []
    }, [dataAnggota, isFetchingAnggota])

    const DATA_BUKU = useMemo(() => {
        return dataBuku ? dataBuku.data : []
    }, [dataBuku, isFetchingBuku])


    useEffect(() => {
        setFormData({
            userId: null,
            bukuId: null,
            tanggal_peminjaman: null,
            jatuh_tempo: null,
            keterangan_peminjaman: null,
        });
        setSearchAnggota("")
        setSearchBuku("")
        refetchAnggota();
        refetchBuku();
        setFormDataError({});
    }, [])

    const [ loadingSend, setLoadingSend ] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {mutate: mutatePost} = useStoreTransaction();
    const handleSubmit = () => {
        setLoadingSend(true)
        setFormDataError({})

        try {
            mutatePost(
                formData,
                {
                    onSuccess: (res) => {
                        successToast({text: res.message})
                        isFinished()
                        navigate('/data-transaksi/peminjaman')
                        
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
                                    userId: errors.userId || "",
                                    bukuId: errors.bukuId || "",
                                    tanggal_peminjaman: errors.tanggal_peminjaman || "",
                                    jatuh_tempo: errors.jatuh_tempo || "",
                                    keterangan_peminjaman: errors.keterangan_peminjaman || ""
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

    const { isOpen: isOpenScanAnggota, onOpen: onOpenScanAnggota, onClose: onCloseScanAnggota } = useDisclosure();
    const { isOpen: isOpenScanBuku, onOpen: onOpenScanBuku, onClose: onCloseScanBuku } = useDisclosure();

    const handleConfirmAnggota = (data: string) => {
        let dataAnggota = DATA_ANGGOTA.find(item => item.identityNumber === data);
        if(dataAnggota) {
            setFormData({...formData, userId: String(dataAnggota.id)})
            onCloseScanAnggota()
        } else {
            setFormData({...formData, userId: ""})
            errorToast({ text: "Nomor identitas tidak ditemukan" })
        }
    }

    const handleConfirmBuku = (data: string) => {
        let dataBuku = DATA_BUKU.find(item => item.isbn === data);
        if(dataBuku) {
            setFormData({...formData, bukuId: String(dataBuku.id)})
            onCloseScanBuku()
        } else {
            setFormData({...formData, bukuId: ""})
            errorToast({ text: "ISBN buku tidak ditemukan" })
        }
    }

    return (
        <main className="flex flex-col gap-4">
            <ConfirmAlert 
                isOpen={isOpen} 
                isLoading={loadingSend} 
                text={"Apakah anda yakin untuk menyimpan data ini ?"} 
                onClose={onClose}
                confirmAction={() => handleSubmit()}
            />
            <ScanAnggota
                isOpen={isOpenScanAnggota}
                onClose={onCloseScanAnggota}
                confirmAction={(data: string) => handleConfirmAnggota(data)}
            />
            <ScanBuku
                isOpen={isOpenScanBuku}
                onClose={onCloseScanBuku}
                confirmAction={(data: string) => handleConfirmBuku(data)}
            />
            <BreadcrumbWithCustomSeparator icon={TbReport} />
            <div className="bg-white lg:p-8 p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="border border-primary py-2 sm:px-4 px-2 sm:text-left text-center rounded-md">
                    <h1 className="text-primary font-semibold">FORM TAMBAH PEMINJAMAN</h1>
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
                                    placeholder="AUTO_CREATED"
                                    readOnly
                                    classNames={{
                                        inputWrapper: "border border-primary rounded bg-slate-50 cursor-not-allowed",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary cursor-not-allowed",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="w-full flex items-center justify-between mb-2">
                                    <label htmlFor="author" className="text-primary font-semibold text-sm">Pilih Peminjam (Anggota)</label><br />
                                    <Button onPress={onOpenScanAnggota} variant="bordered" color="primary" size="sm" className="flex items-center justify-center"><FaQrcode /> Scan</Button>
                                </div>
                                <Autocomplete
                                    id="provinceId"
                                    onSelectionChange={(value) => setFormData({...formData, userId: String(value)})}
                                    defaultItems={DATA_ANGGOTA.filter((dt) =>
                                        dt.name?.toLowerCase().includes(searchAnggota.toLowerCase()) ||
                                        dt.identityNumber?.toLowerCase().includes(searchAnggota.toLowerCase())
                                    )}
                                    selectedKey={formData.userId}
                                    aria-label="Data pengguna"
                                    placeholder="Cari berdasarkan nama / id peminjam"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    inputProps={{
                                        classNames: {
                                            inputWrapper: "border border-primary rounded",
                                            input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        },
                                    }}
                                >
                                    {(dt) => <AutocompleteItem key={dt.id} textValue={`${dt.name} - ${dt.identityNumber}`}>{dt.name} - {dt.identityNumber}</AutocompleteItem>}
                                </Autocomplete>
                                <div className="text-danger italic text-xs">{formDataError.userId}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <Divider className="bg-primary my-4" />
                            </div>
                            <div className="sm:col-span-2">
                                <div className="w-full flex items-center justify-between mb-2">
                                    <label htmlFor="author" className="text-primary font-semibold text-sm">Pilih Buku</label><br />
                                    <Button onPress={onOpenScanBuku} variant="bordered" color="primary" size="sm" className="flex items-center justify-center"><FaQrcode /> Scan</Button>
                                </div>
                                <Autocomplete
                                    id="bukuId"
                                    onSelectionChange={(value) => setFormData({...formData, bukuId: String(value)})}
                                    defaultItems={DATA_BUKU.filter((dt) =>
                                        dt.judul?.toLowerCase().includes(searchBuku.toLowerCase()) ||
                                        dt.penulis?.toLowerCase().includes(searchBuku.toLowerCase())
                                    )}
                                    selectedKey={formData.bukuId}
                                    aria-label="Data pengguna"
                                    placeholder="Cari berdasarkan judul / penulis"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    inputProps={{
                                        classNames: {
                                            inputWrapper: "border border-primary rounded",
                                            input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        },
                                    }}
                                >
                                    {(dt) => <AutocompleteItem key={dt.id} textValue={`${dt.judul} - ${dt.penulis}`}>{dt.judul} - {dt.penulis} ({dt.type})</AutocompleteItem>}
                                </Autocomplete>
                                <div className="text-danger italic text-xs">{formDataError.bukuId}</div>
                            </div>
                            <div>
                                <label htmlFor="tanggal_peminjaman" className="text-primary font-semibold text-sm">Tanggal Peminjaman</label>
                                <Input
                                    type="date"
                                    value={formData.tanggal_peminjaman || ""}
                                    onChange={(e) => setFormData({...formData, tanggal_peminjaman: e.target.value})}
                                    aria-label="Nomor Urut"
                                    id="tanggal_peminjaman"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Tanggal peminjaman disini"
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.tanggal_peminjaman}</div>
                            </div>
                            <div>
                                <label htmlFor="jatuh_tempo" className="text-primary font-semibold text-sm">Tanggal Jatuh Tempo</label>
                                <Input
                                    type="date"
                                    value={formData.jatuh_tempo || ""}
                                    onChange={(e) => setFormData({...formData, jatuh_tempo: e.target.value})}
                                    aria-label="Nomor Urut"
                                    id="jatuh_tempo"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Tanggal peminjaman disini"
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.jatuh_tempo}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="keterangan_peminjaman" className="text-primary font-semibold text-sm">Keterangan Peminjaman</label>
                                <Textarea
                                    value={formData.keterangan_peminjaman || ""}
                                    onChange={(e) => setFormData({...formData, keterangan_peminjaman: e.target.value})}
                                    aria-label="Nomor Urut"
                                    id="keterangan_peminjaman"
                                    variant="bordered"
                                    color="primary"
                                    radius="sm"
                                    placeholder="Keterangan peminjaman disini"
                                    classNames={{
                                        inputWrapper: "border border-primary rounded",
                                        input: "text-primary text-xs font-medium italic placeholder:text-primary",
                                        label: "text-primary font-semibold text-sm"
                                    }}
                                />
                                <div className="text-danger italic text-xs">{formDataError.keterangan_peminjaman}</div>
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
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, DateRangePicker, DateValue, Input, RangeValue, useDisclosure } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiDownload, BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { BsEye, BsPlusSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { TbReport, TbRestore } from "react-icons/tb";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { TransactionRes } from "@/interface/response/Transaction.interface";
import { useDeletedTransaction, useGetListTransaction } from "@/services/transaksi";
import { formatDateDMYIn } from "@/utils/dateFormat";
import { TransaksiExport } from "@/services/transaksi/http";
import { FaQrcode } from "react-icons/fa6";
import { ScanAnggota } from "@/components/Modals/scan/ScanBarcode";

export default function DataBerita(){

    const navigate = useNavigate();

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [judulSearch, setJudulSearch] = useState<string | null>(null);
    const [identitasSearch, setIdentitasSearch] = useState<string | null>(null);
    const [penulisSearch, setPenulisSearch] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);
    
    const [selectedId, setSelectedId] = useState<string>('')

    const {
        data: dataNews,
        refetch: refetchNews,
        isLoading: isLoadingNews,
        isFetching: isFetchingNews,
    } = useGetListTransaction(
        limit,
        currentPage,
        identitasSearch,
        judulSearch,
        penulisSearch,
        startDate,
        endDate
    );
    
    const NEWS_DATA = useMemo(() => {
        if (!dataNews || !dataNews.data) return [];
        setTotalPage(dataNews.data.pagination.totalPages || 0);
        setTotalData(dataNews.data.pagination.totalItems || 0);
        setFromPage(dataNews.data.pagination.from || 0);
        setToPage(dataNews.data.pagination.to || 0);

        return dataNews.data.data
    }, [dataNews, currentPage]);

    useEffect(() => {
        refetchNews();
    }, [currentPage]);

    const columnHelper = createColumnHelper<TransactionRes>();

    const columns = useMemo(
        () => [
            columnHelper.accessor("transaction_code", {
                id: "transaction_code",
                cell: (info) => info.getValue(),
                header: () => <span>Kode Transaksi</span>,
            }),
            columnHelper.accessor("nama_anggota", {
                id: "nama_anggota",
                cell: (info) => info.getValue(),
                header: () => <span>Nama Peminjam</span>,
            }),
            columnHelper.accessor("id_anggota", {
                id: "id_anggota",
                cell: (info) => info.getValue(),
                header: () => <span>ID Peminjam</span>,
            }),
            columnHelper.accessor("judul_buku", {
                id: "judul_buku",
                cell: (info) => info.getValue(),
                header: () => <span>Judul Buku</span>,
            }),
            columnHelper.accessor("tanggal_peminjaman", {
                id: "tanggal_peminjaman",
                cell: (info) => info.getValue() ? formatDateDMYIn(info.getValue() as string) : "-",
                header: () => <span>Tanggal Peminjaman</span>,
            }),
            columnHelper.accessor("jatuh_tempo", {
                id: "jatuh_tempo",
                cell: (info) => info.getValue() ? formatDateDMYIn(info.getValue() as string) : "-",
                header: () => <span>Jatuh Tempo</span>,
            }),
            columnHelper.accessor("tanggal_pengembalian", {
                id: "tanggal_pengembalian",
                cell: (info) => info.getValue() ? formatDateDMYIn(info.getValue() as string) : "-",
                header: () => <span>Tanggal Pengembalian</span>,
            }),
            columnHelper.accessor("status_pengembalian", {
                id: "status_pengembalian",
                cell: (info) => {
                    let status = info.getValue() as string;
                    if(status === "Tepat Waktu") {
                        return (
                            <span className="text-primary font-medium">{status}</span>
                        )
                    } else if(status === "Terlambat") {
                        return (
                            <span className="text-danger font-medium">{status}</span>
                        )
                    } else {
                        return (
                            <span className="text-black font-medium">{status}</span>
                        )
                    }
                },
                header: () => <span>Status</span>,
            }),
            {
                id: "action",
                header: () => <span>Aksi</span>,
                cell: ({ row }: { row: Row<TransactionRes> }) => {
                    let transaction_code = row.original.transaction_code || "";
                    let tanggal_pengembalian = row.original.tanggal_pengembalian || "";

                    return (
                        <div className="flex items-center gap-2">
                            <Button onPress={() => navigate(`/data-transaksi/peminjaman/detail/${transaction_code}`)} isIconOnly size="sm" variant="bordered" color="primary"><BsEye /></Button>
                            {!tanggal_pengembalian && (
                                <Button onPress={() => navigate(`/data-transaksi/peminjaman/edit-data/${transaction_code}`)} isIconOnly size="sm" variant="bordered" color="warning"><BiEdit /></Button>
                            )}
                            <Button onPress={() => deletedAction(transaction_code)} isIconOnly size="sm" variant="bordered" color="danger"><BiTrash /></Button>
                        </div>
                    );
                },
            },
        ],
        [currentPage],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchNews();
    }

    const handleReset = () => {
        setJudulSearch(null);
        setPenulisSearch(null);
        setStartDate(null);
        setEndDate(null);
        setDateRange(null);
        setIdentitasSearch(null)
        setTimeout(() => {
            setCurrentPage(1);
            refetchNews();
        }, 500);
    }

    const [ isLoadingAction, setLoadingAction ] = useState<boolean>(false);

    const { isOpen: isOpenDeleted, onOpen: onOpenDeleted, onClose: onCloseDeleted } = useDisclosure();
    const {mutate: mutateDeleted} = useDeletedTransaction();
    const deletedAction = (id: string) => {
        setSelectedId(id)
        onOpenDeleted()
    }
    const handleDelete = (id: string) => {
        setLoadingAction(true)
        try {
            mutateDeleted(
                {userId: id},
                {
                    onSuccess: (res) => {
                        setTimeout(() => {
                            setCurrentPage(1);
                            successToast({text: res.message})
                            refetchNews()
                            setSelectedId("")
                            onCloseDeleted()
                            isFinished()
                        }, 500);
                        
                    },
                    onError: (error: AxiosError<BaseErrorRes>) => {
                        isFinished()
                        if (error.response && error.response.data) {
                            const { message } = error.response.data;
                            errorToast({ text: message || "" });
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
        setLoadingAction(false);
    }

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    }

    useEffect(() => {
        if (dateRange?.start && dateRange?.end) {
            setStartDate(formatDate(dateRange.start.toDate('Asia/Jakarta')));
            setEndDate(formatDate(dateRange.end.toDate('Asia/Jakarta')));
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    }, [dateRange])

    const [ isLoadingExport, setIsLoadingExport ] = useState<boolean>(false)
        
    const handleDownloadExport = async () => {
        try {
            setIsLoadingExport(true);
            await TransaksiExport();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: { status: number } | any) {
            if (error?.status === 404) {
                errorToast({
                    text: "Data Customer atau Akun Bank anda tidak ditemukan",
                });
            }
            throw error;
        } finally {
            setIsLoadingExport(false);
        }
    };

    const { isOpen: isOpenScanAnggota, onOpen: onOpenScanAnggota, onClose: onCloseScanAnggota } = useDisclosure();

    const handleConfirmAnggota = (data: string) => {
        setJudulSearch(null);
        setPenulisSearch(null);
        setStartDate(null);
        setEndDate(null);
        setDateRange(null);
        setIdentitasSearch(data)
        setTimeout(() => {
            onCloseScanAnggota();
            setCurrentPage(1);
            refetchNews();
        }, 500);
    }

    return (
        <main className="flex flex-col gap-4">
            <ConfirmAlert 
                isOpen={isOpenDeleted} 
                isLoading={isLoadingAction} 
                text={"Apakah anda yakin untuk menghapus data terpilih? Data yang dihapus tidak bisa dikembalikan"} 
                onClose={onCloseDeleted}
                confirmAction={() => handleDelete(selectedId)}
            />

            <ScanAnggota
                isOpen={isOpenScanAnggota}
                onClose={onCloseScanAnggota}
                confirmAction={(data: string) => handleConfirmAnggota(data)}
            />

            <BreadcrumbWithCustomSeparator icon={TbReport} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex items-center justify-between sm:flex-row flex-col gap-2">
                    <Button
                        size="sm"
                        radius="sm"
                        color="primary"
                        className="font-semibold flex items-center"
                        onPress={() => navigate('/data-transaksi/peminjaman/tambah-data')}
                    >
                        <BsPlusSquareFill /> Tambah Data Peminjaman
                    </Button>
                    <Button
                        onPress={handleDownloadExport}
                        isLoading={isLoadingExport}
                        size="sm"
                        radius="sm"
                        className="bg-black text-white font-semibold flex items-center sm:w-auto w-full"
                    >
                        <BiDownload size={16} /> Export Data
                    </Button>
                </div>
            </div>
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between lg:flex-row flex-col gap-2">
                    <div className="flex items-center lg:flex-row flex-col gap-2 w-full">
                    <div className="w-full">
                            <label htmlFor="search-id" className="font-semibold text-sm text-primary">ID Peminjam</label>
                            <Input
                                id="search-id"
                                aria-label="id"
                                placeholder="Cari berdasarkan id peminjam"
                                variant="bordered" 
                                radius="sm"
                                value={identitasSearch || ""}
                                onChange={(e) => setIdentitasSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                                startContent={
                                    <Button onPress={onOpenScanAnggota} size="sm" variant="bordered" color="primary" className="border-none" isIconOnly><FaQrcode /></Button>
                                }
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="search-nim" className="font-semibold text-sm text-primary">Peminjam</label>
                            <Input
                                id="search-nim"
                                aria-label="NIM"
                                placeholder="Cari berdasarkan nama peminjam"
                                variant="bordered" 
                                radius="sm"
                                value={penulisSearch || ""}
                                onChange={(e) => setPenulisSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Judul Buku</label>
                            <Input
                                id="search-name"
                                aria-label="Nama"
                                placeholder="Cari berdasarkan judul buku"
                                variant="bordered" 
                                radius="sm"
                                value={judulSearch || ""}
                                onChange={(e) => setJudulSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="search-nim" className="font-semibold text-sm text-primary">Tanggal Peminjaman</label>
                            <DateRangePicker
                                aria-label="Pilih Tanggal"
                                labelPlacement="outside"
                                radius="sm"
                                variant="bordered"
                                color="primary"
                                selectorButtonPlacement="start"
                                className="w-full"
                                classNames={{
                                    inputWrapper: "border-[0.8px] border-primary",
                                    input: "text-xs",
                                    selectorIcon: "text-sm"
                                }}
                                value={dateRange}
                                onChange={setDateRange}
                                granularity="day"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            radius="sm"
                            variant="bordered"
                            onPress={handleSearch}
                            className="border border-primary text-primary font-semibold flex items-center sm:w-auto w-full"
                        >
                            <BiSearch size={16} /> Cari
                        </Button>
                        <Button
                            radius="sm"
                            variant="bordered"
                            onPress={handleReset}
                            className="border border-danger text-danger font-semibold flex items-center sm:w-auto w-full"
                        >
                            <TbRestore size={16} /> Reset
                        </Button>
                    </div>
                </div>
                <MyReactTable<TransactionRes>
                    data={NEWS_DATA}
                    columns={columns}
                    currentPage={currentPage}
                    totalDatas={totalData}
                    totalPage={totalPage}
                    fromPage={fromPage}
                    toPage={toPage}
                    handlePageChange={(page: number) => setCurrentPage(page)}
                    isFetching={isFetchingNews}
                    isLoading={isLoadingNews}
                />
            </div>
        </main>
    )
}
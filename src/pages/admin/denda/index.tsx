import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, DateRangePicker, DateValue, Input, RangeValue } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiEdit, BiSearch } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { TbReport, TbRestore } from "react-icons/tb";
import { TransactionRes } from "@/interface/response/Transaction.interface";
import { useGetListDenda } from "@/services/transaksi";
import { formatDateDMYIn } from "@/utils/dateFormat";

export default function DataDenda(){

    const navigate = useNavigate();

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [judulSearch, setJudulSearch] = useState<string | null>(null);
    const [penulisSearch, setPenulisSearch] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);

    const {
        data: dataNews,
        refetch: refetchNews,
        isLoading: isLoadingNews,
        isFetching: isFetchingNews,
    } = useGetListDenda(
        limit,
        currentPage,
        penulisSearch,
        judulSearch,
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
            columnHelper.accessor("tanggal_peminjaman", {
                id: "tanggal_peminjaman",
                cell: (info) => info.getValue() ? formatDateDMYIn(info.getValue() as string) : "-",
                header: () => <span>Tanggal Peminjaman</span>,
            }),
            columnHelper.accessor("tanggal_pengembalian", {
                id: "tanggal_pengembalian",
                cell: (info) => info.getValue() ? formatDateDMYIn(info.getValue() as string) : "-",
                header: () => <span>Tanggal Pengembalian</span>,
            }),
            columnHelper.accessor("tanggal_bayar", {
                id: "tanggal_bayar",
                cell: (info) => info.getValue() ? formatDateDMYIn(info.getValue() as string) : "-",
                header: () => <span>Tanggal Bayar</span>,
            }),
            columnHelper.accessor("total_keterlambatan", {
                id: "total_keterlambatan",
                cell: (info) => `${info.getValue() as number} hari`,
                header: () => <span>Total Keterlambatan</span>,
            }),
            columnHelper.accessor("denda_keterlambatan", {
                id: "denda_keterlambatan",
                cell: (info) => `Rp ${(info.getValue() as number).toLocaleString('id-ID')}`,
                header: () => <span>Total Denda</span>,
            }),
            columnHelper.accessor("status_pembayaran", {
                id: "status_pembayaran",
                cell: (info) => {
                    let status = info.getValue() as string;
                    if(status === "Lunas") {
                        return (
                            <span className="text-primary font-medium">{status}</span>
                        )
                    } else {
                        return (
                            <span className="text-danger font-medium">{status}</span>
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
                    let status_pembayaran = row.original.tanggal_pengembalian || "";

                    return (
                        <div className="flex items-center gap-2">
                            <Button onPress={() => navigate(`/data-transaksi/laporan-denda/detail/${transaction_code}`)} isIconOnly size="sm" variant="bordered" color="primary"><BsEye /></Button>
                            {status_pembayaran !== "Lunas" && (
                                <Button onPress={() => navigate(`/data-transaksi/laporan-denda/edit-data/${transaction_code}`)} isIconOnly size="sm" variant="bordered" color="warning"><BiEdit /></Button>
                            )}
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
        setTimeout(() => {
            setCurrentPage(1);
            refetchNews();
        }, 500);
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


    return (
        <main className="flex flex-col gap-4">
            <BreadcrumbWithCustomSeparator icon={TbReport} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Kode Transaksi</label>
                            <Input
                                id="search-name"
                                aria-label="Nama"
                                placeholder="Cari berdasarkan kode transaksi"
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
                            <label htmlFor="search-nim" className="font-semibold text-sm text-primary">Tanggal Peminjaman / Pengembalian</label>
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
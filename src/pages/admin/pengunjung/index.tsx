import { FaUserGear } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, Input } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiSearch } from "react-icons/bi";
import { TbRestore } from "react-icons/tb";
import { formatedDate } from "@/utils/dateFormat";
import { useGetListVisitor } from "@/services/visitor";
import { ListVisitorRes } from "@/interface/response/Visitor.interface";

export default function DataPengunjung(){

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [nameSearch, setNameSearch] = useState<string | null>(null);
    const [memberSearch, setMemberSearch] = useState<string | null>(null);
    const [dateSearch, setDateSearch] = useState<string | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);

    const {
        data: dataVisitor,
        refetch: refetchVisitor,
        isLoading: isLoadingVisitor,
        isFetching: isFetchingVisitor,
    } = useGetListVisitor(
        limit,
        currentPage,
        memberSearch,
        nameSearch,
        dateSearch
    );
    
    const PETUGAS_DATA = useMemo(() => {
        if (!dataVisitor || !dataVisitor.data) return [];
        setTotalPage(dataVisitor.data.pagination.totalPages || 0);
        setTotalData(dataVisitor.data.pagination.totalItems || 0);
        setFromPage(dataVisitor.data.pagination.from || 0);
        setToPage(dataVisitor.data.pagination.to || 0);

        return dataVisitor.data.data
    }, [dataVisitor, currentPage]);


    const columnHelper = createColumnHelper<ListVisitorRes>();

    const columns = useMemo(
        () => [
            columnHelper.accessor("time", {
                id: "time",
                cell: (info) => {
                    const time = info.getValue() as string;
                    return (
                        <div className="py-1">
                            {formatedDate(time)}
                        </div>
                    )
                },
                filterFn: "includesString",
                header: () => <span>Hari dan Tanggal</span>,
            }),
            columnHelper.accessor("member", {
                id: "member",
                cell: (info) => info.getValue(),
                header: () => <span>ID Anggota</span>,
            }),
            columnHelper.accessor("name", {
                id: "name",
                cell: (info) => info.getValue(),
                header: () => <span>Nama Pengunjung</span>,
            }),
            columnHelper.accessor("activity", {
                id: "activity",
                cell: (info) => info.getValue(),
                header: () => <span>Kegiatan</span>,
            }),
        ],
        [currentPage],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchVisitor();
    }

    const handleReset = () => {
        setNameSearch(null);
        setMemberSearch(null);
        setDateSearch(null);
        setTimeout(() => {
            setCurrentPage(1);
            refetchVisitor();
        }, 500);
    }
    return (
        <main className="flex flex-col gap-4">
            <BreadcrumbWithCustomSeparator icon={FaUserGear} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full">
                            <label htmlFor="search-member" className="font-semibold text-sm text-primary">ID Anggota</label>
                            <Input
                                id="search-member"
                                aria-label="member"
                                placeholder="Cari berdasarkan id anggota"
                                variant="bordered" 
                                radius="sm"
                                value={memberSearch || ""}
                                onChange={(e) => setMemberSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Nama</label>
                            <Input
                                id="search-name"
                                aria-label="Nama"
                                placeholder="Cari berdasarkan nama"
                                variant="bordered" 
                                radius="sm"
                                value={nameSearch || ""}
                                onChange={(e) => setNameSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="search-date" className="font-semibold text-sm text-primary">Tanggal Kunjungan</label>
                            <Input
                                id="search-date"
                                aria-label="date"
                                type="date"
                                placeholder="Cari berdasarkan tanggal"
                                variant="bordered" 
                                radius="sm"
                                value={dateSearch || ""}
                                onChange={(e) => setDateSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
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
                <MyReactTable<ListVisitorRes>
                    data={PETUGAS_DATA}
                    columns={columns}
                    currentPage={currentPage}
                    totalDatas={totalData}
                    totalPage={totalPage}
                    fromPage={fromPage}
                    toPage={toPage}
                    handlePageChange={(page: number) => setCurrentPage(page)}
                    isFetching={isFetchingVisitor}
                    isLoading={isLoadingVisitor}
                />
            </div>
        </main>
    )
}
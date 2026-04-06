import { FaUserGear } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button, CalendarDate, Checkbox, DateRangePicker, Input, RangeValue, Select, SelectItem } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiSearch } from "react-icons/bi";
import { TbRestore } from "react-icons/tb";
import { formatedDate } from "@/utils/dateFormat";
import { useGetListVisitor } from "@/services/visitor";
import { ListVisitorRes } from "@/interface/response/Visitor.interface";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { BsFileExcel, BsFilePdf } from "react-icons/bs";

const fmtDate = (d: CalendarDate) =>
  `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

export default function DataPengunjung(){

    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [selectedRows, setSelectedRows] = useState<ListVisitorRes[]>([]);

    const [nameSearch, setNameSearch] = useState<string | null>(null);
    const [memberSearch, setMemberSearch] = useState<string | null>(null);
    const [prodi, setProdi] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<RangeValue<CalendarDate> | null>(null);
    
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
        selectedDate && selectedDate.start ? fmtDate(selectedDate.start) : "",
        selectedDate && selectedDate.end ? fmtDate(selectedDate.end) : "",
        prodi
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

    const toggleRow = (row: ListVisitorRes) => {
        setSelectedRows((prev) => {
            const exists = prev.find((r) => r.id === row.id);
            if (exists) {
                return prev.filter((r) => r.id !== row.id);
            }
            return [...prev, row];
        });
    };

    const isRowSelected = (row: ListVisitorRes) =>
        selectedRows.some((r) => r.id === row.id);

    const toggleAll = () => {
        if (selectedRows.length === PETUGAS_DATA.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(PETUGAS_DATA);
        }
    };

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "select",
                header: () => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            isSelected={
                                PETUGAS_DATA.length > 0 &&
                                selectedRows.length === PETUGAS_DATA.length
                            }
                            onValueChange={toggleAll}
                            size="sm"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            isSelected={isRowSelected(row.original)}
                            onValueChange={() => toggleRow(row.original)}
                            size="sm"
                        />
                    </div>
                ),
            }),
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
            columnHelper.accessor("prodi", {
                id: "prodi",
                cell: (info) => info.getValue(),
                header: () => <span>Program Studi</span>,
            }),
            columnHelper.accessor("activity", {
                id: "activity",
                cell: (info) => info.getValue(),
                header: () => <span>Kegiatan</span>,
            }),
        ],
        [currentPage, selectedRows, PETUGAS_DATA],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchVisitor();
    }

    const handleReset = () => {
        setProdi(null);
        setNameSearch(null);
        setMemberSearch(null);
        setSelectedDate(null);
        setTimeout(() => {
            setCurrentPage(1);
            refetchVisitor();
        }, 500);
    }

    const getExportData = (): ListVisitorRes[] => {
        // kalau ada checkbox → pakai yang dicentang
        if (selectedRows.length > 0) {
            return selectedRows;
        }
        // kalau tidak → pakai data hasil filter (yang tampil)
        return PETUGAS_DATA;
    };

    const handleExportPDF = () => {
        const data = getExportData();
        if (data.length === 0) return;

        const doc = new jsPDF("l", "mm", "a4");

        // ===== HEADER =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(
            "DATA PENGUNJUNG PERPUSTAKAAN",
            pageWidth / 2,
            15,
            { align: "center" }
        );

        doc.setFontSize(10);
        if( selectedDate && selectedDate.start && selectedDate.end ) {
            doc.text(`${formatedDate(fmtDate(selectedDate.start || "-"))} s/d ${formatedDate(fmtDate(selectedDate.end || "-"))}`, pageWidth / 2, 22, { align: "center" });
        }
        doc.setFont("helvetica", "normal");
        autoTable(doc, {
            startY: 28,
            head: [[
                "Hari & Tanggal",
                "ID Anggota",
                "Nama Pengunjung",
                "Program Studi",
                "Kegiatan"
            ]],
            body: data.map((item) => [
                item.time ? formatedDate(item.time) : null,
                item.member,
                item.name,
                item.prodi,
                item.activity,
            ]),
            styles: {
                fontSize: 9,
            },
            headStyles: {
                fillColor: [30, 64, 175],
                textColor: 255,
            },
        });

        const pdfBlob = doc.output("bloburl");
        window.open(pdfBlob, "_blank");
    };

    const handleExportExcel = () => {
        const data = getExportData();
        if (data.length === 0) return;

        const formattedData = data.map((item, index) => ({
            No: index + 1,
            "Hari & Tanggal": item.time ? formatedDate(item.time) : "-",
            "ID Anggota": item.member || "-",
            "Nama Pengunjung": item.name || "-",
            "Program Studi": item.prodi || "-",
            "Kegiatan": item.activity || "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();

        const range = XLSX.utils.decode_range(worksheet["!ref"] as string);

        // ===== STYLE DEFINITIONS =====
        const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
        };

        // ===== APPLY STYLE =====
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (!cell) continue;

                // HEADER
                if (R === 0) {
                    cell.s = {
                        font: { bold: true, color: { rgb: "FFFFFF" } },
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                        },
                        fill: {
                            fgColor: { rgb: "1E40AF" }, // biru
                        },
                        border: borderStyle,
                    };
                }
                // BODY
                else {
                    cell.s = {
                        alignment: {
                            horizontal: C === 0 ? "center" : "left",
                            vertical: "center",
                        },
                        border: borderStyle,
                    };
                }
            }
        }

        // ===== AUTO WIDTH =====
        worksheet["!cols"] = Object.keys(formattedData[0]).map((key) => {
            const maxLength = Math.max(
                key.length,
                ...formattedData.map(
                    (row) => row[key as keyof typeof row]?.toString().length || 0
                )
            );
            return { wch: maxLength + 3 };
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pengunjung");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "data-pengunjung.xlsx");
    };
    return (
        <main className="flex flex-col gap-4">
            <BreadcrumbWithCustomSeparator icon={FaUserGear} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full max-w-24">
                            <label htmlFor="tampilkan" className="font-semibold text-sm text-primary">Tampilkan</label>
                            <Select
                                id="tampilkan"
                                aria-label="member"
                                placeholder="Cari berdasarkan id anggota"
                                variant="bordered" 
                                radius="sm"
                                selectedKeys={[limit.toString() || "10"]}
                                onChange={(e) => setLimit(Number(e.target.value || 10))}
                                classNames={{
                                    trigger: 'border border-primary',
                                    value: 'text-primary'
                                }}
                            >
                                <SelectItem key={"5"}>5</SelectItem>
                                <SelectItem key={"10"}>10</SelectItem>
                                <SelectItem key={"25"}>25</SelectItem>
                                <SelectItem key={"50"}>50</SelectItem>
                                <SelectItem key={"100"}>100</SelectItem>
                                <SelectItem key={"250"}>250</SelectItem>
                                <SelectItem key={"500"}>500</SelectItem>
                                <SelectItem key={"1000"}>1000</SelectItem>
                            </Select>
                        </div>
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
                            <DateRangePicker
                                id="search-date"
                                aria-label="date"
                                variant="bordered" 
                                radius="sm"
                                value={selectedDate}
                                onChange={(val) => setSelectedDate(val)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary',
                                    base: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="prodi" className="font-semibold text-sm text-primary">Program Studi</label>
                            <Input
                                id="prodi"
                                aria-label="prodi"
                                placeholder="Cari berdasarkan program studi"
                                variant="bordered" 
                                radius="sm"
                                value={prodi || ""}
                                onChange={(e) => setProdi(e.target.value)}
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
                        <Button
                            radius="sm"
                            color="danger"
                            onPress={handleExportPDF}
                            isDisabled={selectedRows.length === 0}
                        >
                            <BsFilePdf /> Export PDF
                        </Button>
                        <Button
                            radius="sm"
                            variant="bordered"
                            color="success"
                            onPress={handleExportExcel}
                            isDisabled={selectedRows.length === 0}
                        >
                            <BsFileExcel /> Export Excel
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
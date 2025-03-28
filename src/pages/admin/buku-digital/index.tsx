import { FaBook } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, Checkbox, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiDownload, BiEdit, BiSearch, BiTrash, BiUpload } from "react-icons/bi";
import { BsEye, BsPlusSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { TbRestore } from "react-icons/tb";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import ImportBukuDigital from "@/components/Modals/import/ImportBuukuDigital";
import { useDeletedBukuDigital, useGetListBukuDigital, usePostSelectedBukuDigital } from "@/services/buku-digital";
import { BukuDigitalListRes } from "@/interface/response/BukuDigital.interface";
import { DataBukuDigitalExport } from "@/services/buku-digital/http";
import store from "@/redux/store";

export default function DataBukuDigital(){

    const navigate = useNavigate();

    const { auth } = store.getState();

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [judulSearch, setJudulSearch] = useState<string | null>(null);
    const [penulisSearch, setPenulisSearch] = useState<string | null>(null);
    const [tahunSearch, setTahunSearch] = useState<string | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);
    
    const [selectedId, setSelectedId] = useState<string>('')

    const {
        data: dataBukuDigital,
        refetch: refetchBukuDigital,
        isLoading: isLoadingBukuDigital,
        isFetching: isFetchingBukuDigital,
    } = useGetListBukuDigital(
        limit,
        currentPage,
        judulSearch,
        penulisSearch,
        tahunSearch
    );
    
    const MAHASISWA_DATA = useMemo(() => {
        if (!dataBukuDigital || !dataBukuDigital.data) return [];
        setTotalPage(dataBukuDigital.data.pagination.totalPages || 0);
        setTotalData(dataBukuDigital.data.pagination.totalItems || 0);
        setFromPage(dataBukuDigital.data.pagination.from || 0);
        setToPage(dataBukuDigital.data.pagination.to || 0);

        return dataBukuDigital.data.data
    }, [dataBukuDigital, currentPage]);

    const [ checkBoxData, setCheckBoxData ] = useState<string[]>([]);

    useEffect(() => {
        refetchBukuDigital();
        setCheckBoxData([])
    }, [currentPage]);


    const handleCheckBox = (value: any) => {
        setCheckBoxData(prevData => {
            if (prevData.includes(value)) {
                return prevData.filter(item => item !== value);
            } else {
                return [...prevData, value];
            }
        });
    }

    const columnHelper = createColumnHelper<BukuDigitalListRes>();

    const columns = useMemo(
        () => [
            {
                id: "select",
                header: () => <span></span>,
                cell: ({ row }: { row: Row<BukuDigitalListRes> }) => {
                    const { id } = row.original;
                    const isChecked = checkBoxData.includes(id);
                    return <Checkbox value={id} key={id} isSelected={isChecked} onChange={() => handleCheckBox(id)} />
                },
            },
            columnHelper.accessor("cover", {
                id: "cover",
                cell: (info) => {
                    const cover = info.getValue() as string;
                    return (
                        cover ? (
                            <div className="border w-16 p-1 flex items-center justify-center border-primary rounded-md overflow-hidden">
                                <img src={cover} alt="cover-buku" className="rounded-md" />
                            </div>
                        ) : (
                            <div className="border w-16 h-16 flex items-center justify-center border-primary rounded-md">
                                <FaBook className="text-xl" />
                            </div>
                        )
                    )
                },
                filterFn: "includesString",
                header: () => <span>Cover Buku</span>,
            }),
            columnHelper.accessor("judul", {
                id: "judul",
                cell: (info) => info.getValue(),
                header: () => <span>Judul Buku</span>,
            }),
            columnHelper.accessor("penulis", {
                id: "penulis",
                cell: (info) => info.getValue(),
                header: () => <span>Penulis</span>,
            }),
            columnHelper.accessor("tahun_terbit", {
                id: "tahun_terbit",
                cell: (info) => info.getValue(),
                header: () => <span>Tahun Terbit</span>,
            }),
            columnHelper.accessor("link_book", {
                id: "link_book",
                cell: (info) => {
                    const link = info.getValue() as string;
                    return (
                        <Link to={link} target="__blank" className="italic">Lihat Buku ...</Link>
                    )
                },
                header: () => <span>URL Buku</span>,
            }),
            {
                id: "action",
                header: () => <span>Aksi</span>,
                cell: ({ row }: { row: Row<BukuDigitalListRes> }) => {
                    const { id } = row.original;

                    return (
                        <div className="flex items-center gap-2">
                            <Button onPress={() => navigate(`/data-master/buku-digital/detail/${id}`)} isIconOnly size="sm" variant="bordered" color="primary"><BsEye /></Button>
                            {auth.role !== "Student" && auth.role !== "Teacher" && <Button onPress={() => navigate(`/data-master/buku-digital/edit-data/${id}`)} isIconOnly size="sm" variant="bordered" color="warning"><BiEdit /></Button>}
                            {auth.role !== "Student" && auth.role !== "Teacher" && <Button onPress={() => deletedAction(id)} isIconOnly size="sm" variant="bordered" color="danger"><BiTrash /></Button>}
                        </div>
                    );
                },
            },
        ],
        [currentPage, checkBoxData],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchBukuDigital();
    }

    const handleReset = () => {
        setJudulSearch(null);
        setPenulisSearch(null);
        setTahunSearch(null);
        setTimeout(() => {
            setCurrentPage(1);
            refetchBukuDigital();
        }, 500);
    }

    const [ isLoadingAction, setLoadingAction ] = useState<boolean>(false);

    const { isOpen: isOpenSelected, onOpen: onOpenSelected, onClose: onCloseSelected } = useDisclosure();
    const [ confirmText, setConfirmText ] = useState<string>('')
    const [ selectedAction, setSelectedAction ] = useState<string>('')
    const {mutate: mutateSelection} = usePostSelectedBukuDigital();
    const selectedItemAction = (action: string) => {
        setSelectedAction(action)
        if(action === 'deleted') { 
            setConfirmText('Apakah anda yakin untuk menghapus data terpilih? Data yang dihapus tidak bisa dikembalikan')
            onOpenSelected()
        }
    }
    const handleSelectedItemAction = (action: string) => {
        setLoadingAction(true)
        try {
            const formData: SelectedDataReq = {
                action: action,
                selectedId: checkBoxData
            }
            mutateSelection(
                formData,
                {
                    onSuccess: (res) => {
                        setTimeout(() => {
                            setCurrentPage(1);
                            successToast({text: res.message})
                            refetchBukuDigital()
                            setConfirmText("")
                            setSelectedAction("")
                            onCloseSelected()
                            setCheckBoxData([])
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

    const { isOpen: isOpenDeleted, onOpen: onOpenDeleted, onClose: onCloseDeleted } = useDisclosure();
    const {mutate: mutateDeleted} = useDeletedBukuDigital();
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
                            refetchBukuDigital()
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

    const { isOpen: isOpenImport, onOpen: onOpenImport, onClose: onCloseImport } = useDisclosure();

    const [ isLoadingExport, setIsLoadingExport ] = useState<boolean>(false)
    
    const handleDownloadExport = async () => {
        try {
            setIsLoadingExport(true);
            await DataBukuDigitalExport();
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

    return (
        <main className="flex flex-col gap-4">
            <ConfirmAlert 
                isOpen={isOpenSelected} 
                isLoading={isLoadingAction} 
                text={confirmText} 
                onClose={onCloseSelected}
                confirmAction={() => handleSelectedItemAction(selectedAction)}
            />

            <ConfirmAlert 
                isOpen={isOpenDeleted} 
                isLoading={isLoadingAction} 
                text={"Apakah anda yakin untuk menghapus data terpilih? Data yang dihapus tidak bisa dikembalikan"} 
                onClose={onCloseDeleted}
                confirmAction={() => handleDelete(selectedId)}
            />

            <ImportBukuDigital 
                isOpen={isOpenImport} 
                onClose={onCloseImport}
                confirmAction={() => {
                    refetchBukuDigital();
                    onCloseImport();
                }}
            />
            <BreadcrumbWithCustomSeparator icon={FaBook} />
            {auth.role !== "Student" && auth.role !== "Teacher" && 
                <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                    <div className="flex items-center justify-between sm:flex-row flex-col gap-2">
                        <Button
                            size="sm"
                            radius="sm"
                            color="primary"
                            className="font-semibold flex items-center"
                            onPress={() => navigate('/data-master/buku-digital/tambah-data')}
                        >
                            <BsPlusSquareFill /> Tambah Data Buku
                        </Button>
                        <div className="flex items-center gap-2 sm:flex-row flex-col">
                            <Button
                                size="sm"
                                radius="sm"
                                className="border border-primary text-primary font-semibold flex items-center sm:w-auto w-full bg-transparent"
                                onPress={onOpenImport}
                            >
                                <BiUpload size={16} /> Import Data
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
                </div>
            }
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
                        <div className="w-full">
                            <label htmlFor="search-name" className="font-semibold text-sm text-primary">Judul Buku</label>
                            <Input
                                id="search-name"
                                aria-label="Nama"
                                placeholder="Cari berdasarkan judul"
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
                            <label htmlFor="search-nim" className="font-semibold text-sm text-primary">Penulis</label>
                            <Input
                                id="search-nim"
                                aria-label="NIM"
                                placeholder="Cari berdasarkan penulis"
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
                            <label htmlFor="search-year" className="font-semibold text-sm text-primary">Tahun Terbit</label>
                            <Input
                                type="number"
                                id="search-year"
                                aria-label="year"
                                placeholder="Cari berdasarkan tahun"
                                variant="bordered" 
                                radius="sm"
                                value={tahunSearch || ""}
                                onChange={(e) => setTahunSearch(e.target.value)}
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
                {checkBoxData.length > 0 ? (
                    <div className="flex items-center justify-between sm:flex-row flex-col gap-2">
                        <div className="flex sm:w-auto w-full">
                            <Select
                                aria-label="item-select"
                                placeholder="-- Pilih aksi untuk item yang dipilih --"
                                variant="bordered"
                                color="primary"
                                className="sm:w-80 w-full"
                                classNames={{
                                    trigger: 'border border-primary',
                                    value: 'text-primary'
                                }}
                                size="sm"
                                radius="sm"
                                onChange={(e) => selectedItemAction(e.target.value)}
                            >
                                <SelectItem key={'deleted'} value={'deleted'}>Hapus Data</SelectItem>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-row flex-col sm:text-sm text-xs text-primary">
                            {checkBoxData.length} data dipilih
                        </div>
                    </div>
                ) : null}
                <MyReactTable<BukuDigitalListRes>
                    data={MAHASISWA_DATA}
                    columns={columns}
                    currentPage={currentPage}
                    totalDatas={totalData}
                    totalPage={totalPage}
                    fromPage={fromPage}
                    toPage={toPage}
                    handlePageChange={(page: number) => setCurrentPage(page)}
                    isFetching={isFetchingBukuDigital}
                    isLoading={isLoadingBukuDigital}
                />
            </div>
        </main>
    )
}
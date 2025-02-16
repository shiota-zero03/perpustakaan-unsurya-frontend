import { FaCircle, FaUserGear } from "react-icons/fa6";
import BreadcrumbWithCustomSeparator from "@/components/Breadcrumb";
import { useEffect, useMemo, useState } from "react";
import { PetugasListRes } from "@/interface/response/Petugas.interface";
import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, Checkbox, Input, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import MyReactTable from "@/components/DataTable";
import { BiDownload, BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import { BsEye, BsPlusSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { TbRestore } from "react-icons/tb";
import ConfirmAlert from "@/components/Modals/ConfirmAlert";
import { errorToast, successToast } from "@/utils/toastMessage";
import { AxiosError } from "axios";
import { BaseErrorRes } from "@/interface/response/base.interface";
import { SelectedDataReq } from "@/interface/request/Utils.interface";
import { formatedTimestampWitoutWeekday } from "@/utils/dateFormat";
import { DataPetugasExport } from "@/services/petugas/http";
import { useDeletedPetugas, useGetListPetugas, usePostSelectedPetugas } from "@/services/petugas";

export default function DataPetugas(){

    const navigate = useNavigate();

    const limit = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [nameSearch, setNameSearch] = useState<string | null>(null);
    const [emailSearch, setEmailSearch] = useState<string | null>(null);
    const [statusSearch, setStatusSearch] = useState<string | null>(null);
    
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [fromPage, setFromPage] = useState(1);
    const [toPage, setToPage] = useState(1);
    
    const [selectedId, setSelectedId] = useState<string>('')

    const {
        data: dataPetugas,
        refetch: refetchPetugas,
        isLoading: isLoadingPetugas,
        isFetching: isFetchingPetugas,
    } = useGetListPetugas(
        limit,
        currentPage,
        nameSearch,
        emailSearch,
        statusSearch
    );
    
    const PETUGAS_DATA = useMemo(() => {
        if (!dataPetugas || !dataPetugas.data) return [];
        setTotalPage(dataPetugas.data.pagination.totalPages || 0);
        setTotalData(dataPetugas.data.pagination.totalItems || 0);
        setFromPage(dataPetugas.data.pagination.from || 0);
        setToPage(dataPetugas.data.pagination.to || 0);

        return dataPetugas.data.data
    }, [dataPetugas, currentPage]);

    const [ checkBoxData, setCheckBoxData ] = useState<string[]>([]);

    useEffect(() => {
        refetchPetugas();
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

    const columnHelper = createColumnHelper<PetugasListRes>();

    const columns = useMemo(
        () => [
            {
                id: "select",
                header: () => <span></span>,
                cell: ({ row }: { row: Row<PetugasListRes> }) => {
                    const { id } = row.original;
                    const isChecked = checkBoxData.includes(id);
                    return <Checkbox value={id} key={id} isSelected={isChecked} onChange={() => handleCheckBox(id)} />
                },
            },
            columnHelper.accessor("id", {
                id: "id",
                cell: (info) => {
                    const id = info.getValue() as string;
                    return id.replace(/-/g, '').toUpperCase();
                },
                filterFn: "includesString",
                header: () => <span>ID Petugas</span>,
            }),
            columnHelper.accessor("name", {
                id: "name",
                cell: (info) => info.getValue(),
                header: () => <span>Nama</span>,
            }),
            columnHelper.accessor("email", {
                id: "email",
                cell: (info) => info.getValue(),
                header: () => <span>Email</span>,
            }),
            columnHelper.accessor("status", {
                id: "status",
                cell: (info) => {
                const status = info.getValue();
        
                return (
                    <div className={`${status === 'Aktif' ? 'text-accent-green' : (status === 'Tidak Aktif' ? 'text-accent-gray' : 'text-danger')} flex items-center`}>
                        <div className="italic flex items-center justify-center w-full"><FaCircle size={4} className="me-1" />{status}</div>
                    </div>
                );
                },
                header: () => <span>Status</span>,
            }),
            columnHelper.accessor("waktu_terdaftar", {
                id: "waktu_terdaftar",
                cell: (info) => {
                const waktu_terdaftar = info.getValue();
        
                return (
                    <div>
                        {formatedTimestampWitoutWeekday(waktu_terdaftar || "", "|")}
                    </div>
                );
                },
                header: () => <span>Waktu Terdaftar</span>,
            }),
            {
                id: "action",
                header: () => <span>Aksi</span>,
                cell: ({ row }: { row: Row<PetugasListRes> }) => {
                    const { id } = row.original;

                    return (
                        <div className="flex items-center justify-center gap-2">
                            <Button onPress={() => navigate(`/data-master/petugas/detail/${id}`)} isIconOnly size="sm" variant="bordered" color="primary"><BsEye /></Button>
                            <Button onPress={() => navigate(`/data-master/petugas/edit-data/${id}`)} isIconOnly size="sm" variant="bordered" color="warning"><BiEdit /></Button>
                            <Button onPress={() => deletedAction(id)} isIconOnly size="sm" variant="bordered" color="danger"><BiTrash /></Button>
                        </div>
                    );
                },
            },
        ],
        [currentPage, checkBoxData],
    );

    const handleSearch = () => {
        setCurrentPage(1);
        refetchPetugas();
    }

    const handleReset = () => {
        setNameSearch(null);
        setEmailSearch(null);
        setStatusSearch(null);
        setTimeout(() => {
            setCurrentPage(1);
            refetchPetugas();
        }, 500);
    }

    const [ isLoadingAction, setLoadingAction ] = useState<boolean>(false);

    const { isOpen: isOpenSelected, onOpen: onOpenSelected, onClose: onCloseSelected } = useDisclosure();
    const [ confirmText, setConfirmText ] = useState<string>('')
    const [ selectedAction, setSelectedAction ] = useState<string>('')
    const {mutate: mutateSelection} = usePostSelectedPetugas();
    const selectedItemAction = (action: string) => {
        setSelectedAction(action)
        if(action === 'deleted') { 
            setConfirmText('Apakah anda yakin untuk menghapus data terpilih? Data yang dihapus tidak bisa dikembalikan')
            onOpenSelected()
        } else if(action === 'activated') { 
            setConfirmText('Apakah anda yakin untuk mengaktifkan data terpilih?')
            onOpenSelected()
        } else if(action === 'non-activated') { 
            setConfirmText('Apakah anda yakin untuk menonaktifkan data terpilih?')
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
                            refetchPetugas()
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
    const {mutate: mutateDeleted} = useDeletedPetugas();
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
                            refetchPetugas()
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

    const [ isLoadingExport, setIsLoadingExport ] = useState<boolean>(false)
    
    const handleDownloadExport = async () => {
        try {
            setIsLoadingExport(true);
            await DataPetugasExport();
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

            <BreadcrumbWithCustomSeparator icon={FaUserGear} />
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex items-center justify-between sm:flex-row flex-col gap-2">
                    <Button
                        size="sm"
                        radius="sm"
                        color="primary"
                        className="font-semibold flex items-center"
                        onPress={() => navigate('/data-master/petugas/tambah-data')}
                    >
                        <BsPlusSquareFill /> Tambah Data Petugas
                    </Button>
                    <div className="flex items-center gap-2 sm:flex-row flex-col">
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
            <div className="bg-white p-4 border shadow rounded-md flex flex-col gap-4">
                <div className="flex sm:items-end items-center justify-between sm:flex-row flex-col gap-2">
                    <div className="flex items-center sm:flex-row flex-col gap-2 w-full">
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
                            <label htmlFor="search-email" className="font-semibold text-sm text-primary">Email</label>
                            <Input
                                id="search-email"
                                aria-label="Email"
                                placeholder="Cari berdasarkan email"
                                variant="bordered" 
                                radius="sm"
                                value={emailSearch || ""}
                                onChange={(e) => setEmailSearch(e.target.value)}
                                classNames={{
                                    inputWrapper: 'border border-primary',
                                    input: 'text-primary'
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="search-status" className="font-semibold text-sm text-primary">Status</label>
                            <Select
                                id="search-status"
                                aria-label="Status"
                                placeholder="Cari berdasarkan status"
                                variant="bordered" 
                                radius="sm"
                                selectedKeys={[statusSearch || ""]}
                                onChange={(e) => setStatusSearch(e.target.value)}
                                classNames={{
                                    trigger: 'border border-primary',
                                    value: 'text-primary'
                                }}
                            >
                                <SelectItem key={'Active'} value={'Active'}>
                                    Aktif
                                </SelectItem>
                                <SelectItem key={'InActive'} value={'InActive'}>
                                    Tidak Aktif
                                </SelectItem>
                            </Select>
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
                                <SelectItem key={'deleted'} value={'deleted'}>Hapus Akun</SelectItem>
                                <SelectItem key={'activated'} value={'activated'}>Aktifkan Akun</SelectItem>
                                <SelectItem key={'non-activated'} value={'non-activated'}>Non-Aktifkan Akun</SelectItem>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-row flex-col sm:text-sm text-xs text-primary">
                            {checkBoxData.length} data dipilih
                        </div>
                    </div>
                ) : null}
                <MyReactTable<PetugasListRes>
                    data={PETUGAS_DATA}
                    columns={columns}
                    currentPage={currentPage}
                    totalDatas={totalData}
                    totalPage={totalPage}
                    fromPage={fromPage}
                    toPage={toPage}
                    handlePageChange={(page: number) => setCurrentPage(page)}
                    isFetching={isFetchingPetugas}
                    isLoading={isLoadingPetugas}
                />
            </div>
        </main>
    )
}